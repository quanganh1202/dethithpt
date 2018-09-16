import request from 'request-promise';
import User from '../model/user';
import { tokenGenerator }  from '../../http/middleware/jwt';
import logger from '../libs/logger';
import { dataValidator } from '../libs/ajv';
import { exception } from '../constant/error';
import social from '../constant/socialApiUrl';
import rabbitSender from '../../rabbit/sender';

const userModel = new User();
const schemaId = 'http://dethithpt.com/user-schema#';

async function auth(info) {
  try {
    const { fbToken, ggToken } = info;
    if (!fbToken && !ggToken) {
      return {
        status: 400,
        error: 'You need provide a facebook or gmail access token',
      };
    }
    const url = fbToken ?
      `${social.facebook}?fields=name,email&access_token=${fbToken}`:
      `${social.google}?id_token=${ggToken}`;
    const socialUserInfo = await request.get(url).catch(err => {
      return {
        error: err.error || 'Token invalid',
        status: err.StatusCodeError,
      };
    });
    if (socialUserInfo.error) {
      return socialUserInfo;
    }
    const { name, email, phone } = JSON.parse(socialUserInfo);
    const criteria = [{ email }, { phone }];
    const user = await userModel.getList(criteria);
    let sign;
    if (!user || !user.length) {
      const user = {
        name,
        email,
        status: 2, // Inactive
      };
      const { insertId } = await userModel.addNewUser(user);
      sign = Object.assign({}, user);
      sign.id = insertId;
      const serverNotify = await rabbitSender('user.create', { id: insertId, body: user });
      if (serverNotify.statusCode !== 200) {
        // HERE IS CASE API QUERY iS NOT RESOLVED
        // TODO: ROLLBACK HERE
        logger.error(`[USER]: ${serverNotify.error}`);

        return {
          status: serverNotify.statusCode,
          message: serverNotify.error,
        };
      }
    } else {
      if (user[0].status === 0) {
        return {
          status: 423,
          error: 'Account has been locked',
        };
      }

      sign = {
        id: user[0].id,
        name: user[0].name,
        email: user[0].email,
        status: user[0].status,
      };
    }
    const { token, expiresIn } = tokenGenerator(sign);

    return {
      status: 200,
      token,
      expiresIn,
    };

  } catch (ex) {
    logger.error(ex.message || 'Unexpected error when auth');

    return exception;
  }
}

async function addUser(userInfo) {
  try {
    const resValidate = dataValidator(userInfo, schemaId);
    if (!resValidate.valid) {
      return {
        status: 403,
        error: resValidate.errors,
      };
    }
    const { name, email, phone } = userInfo;
    const criteria = [ { email }, { phone }];
    const user = await userModel.getList(criteria);
    userInfo.status = 1;
    let id;
    if (user && user.length) {
      if (user[0].status !== 2) {
        return {
          error: 'User email or phone number has registed',
          status: 400,
        };
      } else {
        id = user[0].id;
        await userModel.updateUser(id, userInfo);
      }
    } else {
      const { insertId } = await userModel.addNewUser(userInfo);
      id = insertId;
    }
    const sign = {
      id,
      name,
      email,
      status: 1,
    };
    const body = Object.assign({}, sign);
    delete body.id;
    const serverNotify = await rabbitSender('user.create', { id: user[0].id, body: userInfo });
    if (serverNotify.statusCode === 200) {
      const { token, expiresIn } = tokenGenerator(sign);

      return {
        status: 201,
        message: 'Created',
        token,
        expiresIn,
      };
    } else {
      // HERE IS CASE API QUERY iS NOT RESOLVED
      // TODO: ROLLBACK HERE
      logger.error(`[USER]: ${serverNotify.error}`);

      return {
        status: serverNotify.statusCode,
        message: serverNotify.error,
      };
    }

  } catch (ex) {
    logger.error(ex.message || 'Unexpected error when insert an user');

    return exception;
  }
}

async function getAllUsers() {
  const users = await userModel.getList();

  return users;
}

async function deleteUser(id) {
  if (!id && !id.length) {
    return {
      status: 400,
      error: 'Provide an id',
    };
  }

  try {
    await userModel.deleteUser(id);
    const serverNotify = await rabbitSender('user.delete', { id });
    if (serverNotify.statusCode === 200 || serverNotify.statusCode === 204) {
      return {
        status: 200,
        message: 'Deleted',
      };
    } else {
      // HERE IS CASE API QUERY iS NOT RESOLVED
      // TODO: ROLLBACK HERE
      logger.error(`[USER]: ${serverNotify.error}`);

      return {
        status: serverNotify.statusCode,
        message: serverNotify.error,
      };
    }
  } catch (ex) {
    logger.error(ex.message || 'Unexpected error when delete user');

    return exception;
  }
}

async function updateUser(id, userInfo) {
  try {
    const resValidate = dataValidator(userInfo, schemaId);
    if (!resValidate.valid) {
      return {
        status: 403,
        error: resValidate.errors,
      };
    }

    const { email, phone } = userInfo;
    const criteria = [ { email }, { phone }];
    const user = await userModel.getList(criteria);

    if (!user || !user.length || !user[0].status) {
      return {
        error: 'User does not exists',
        status: 400,
      };
    }

    await userModel.updateUser(id, userInfo);
    const serverNotify = await rabbitSender('user.update', { id, body: userInfo });
    if (serverNotify.statusCode === 200) {
      return {
        status: 200,
        message: 'User updated',
      };
    } else {
      // HERE IS CASE API QUERY iS NOT RESOLVED
      // TODO: ROLLBACK HERE
      logger.error(`[USER]: ${serverNotify.error}`);

      return {
        status: serverNotify.statusCode,
        message: serverNotify.error,
      };
    }
  } catch (ex) {
    logger.error(ex.message || 'Unexpected error when update user');

    return exception;
  }
}

async function blockUser(id) {
  try {
    if (!id || !id.length) {
      return {
        error: 'Provide an user id',
        status: 400,
      };
    }
    const user = await userModel.getById(id);
    if (!user || !user.length || !user[0].status) {
      return {
        error: 'User does not exist or blocked',
        status: 400,
      };
    }

    await userModel.updateUser(id, { status: 0 });
    const serverNotify = await rabbitSender('user.update', { id, body: { status: 0 } });
    if (serverNotify.statusCode === 200) {
      return {
        status: 200,
        message: 'Blocked',
      };
    } else {
      // HERE IS CASE API QUERY iS NOT RESOLVED
      // TODO: ROLLBACK HERE
      logger.error(`[USER]: ${serverNotify.error}`);

      return {
        status: serverNotify.statusCode,
        message: serverNotify.error,
      };
    }
  } catch (ex) {
    logger.error(ex.message || 'Unexpected error when block user');

    return exception;
  }
}

export { auth, addUser, getAllUsers, deleteUser, updateUser, blockUser };