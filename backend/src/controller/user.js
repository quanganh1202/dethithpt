import request from 'request-promise';
import User from '../model/user';
import { tokenGenerator }  from '../../server/middleware/jwt';
import logger from '../libs/logger';
import { dataValidator } from '../libs/ajv';
import { exception } from '../constant/error';

const userModel = new User();
const schemaId = 'http://dethithpt.com/user-schema#';
const fbApi = process.env.FB_API || 'https://graph.facebook.com/v3.1';

async function auth(info) {
  try {
    const { fbToken } = info;
    if (!fbToken) {
      return {
        status: 400,
        error: 'You need provide a facebook or gmail access token',
      };
    }
    const url = `${fbApi}/me?fields=id,name,email,birthday,gender&access_token=${fbToken}`;
    const fbUserInfo = await request.get(url).catch(err => {
      return {
        error: err.error || 'FB token invalid',
        status: err.StatusCodeError,
      };
    });
    if (fbUserInfo.error) {
      return fbUserInfo;
    }
    const { name, email, phone } = JSON.parse(fbUserInfo);
    const criteria = [{ email }, { phone }];
    const user = await userModel.getList(criteria);
    let sign;
    if (!user || !user.length) {
      const user = {
        name,
        email,
      };
      await userModel.addNewUser(user);
      sign = user;
    } else {
      sign = user[0];
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
    const { email, phone } = userInfo;
    const criteria = [ { email }, { phone }];
    const user = await userModel.getList(criteria);
    userInfo.status = 1;

    if (user && user.length) {
      if (user[0].status !== 2) {
        return {
          error: 'User email or phone number already existed',
          status: 400,
        };
      } else {
        await userModel.updateUser(user[0].id, userInfo);
      }
    } else {
      await userModel.addNewUser(userInfo);
    }

    return {
      status: 201,
      message: 'Created',
    };
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

    return {
      status: 200,
      message: 'Deleted',
    };
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

    return {
      status: 200,
      message: 'User updated',
    };
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

    return {
      status: 200,
      message: 'Blocked',
    };

  } catch (ex) {
    logger.error(ex.message || 'Unexpected error when block user');

    return exception;
  }
}

export { auth, addUser, getAllUsers, deleteUser, updateUser, blockUser };