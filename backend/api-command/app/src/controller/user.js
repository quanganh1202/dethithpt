import request from 'request-promise';
import User from '../model/user';
import Document from '../model/document';
import { tokenGenerator }  from '../../http/middleware/jwt';
import logger from '../libs/logger';
import { dataValidator } from '../libs/ajv';
import { exception } from '../constant/error';
import social from '../constant/socialApiUrl';
import rabbitSender from '../../rabbit/sender';
import action from '../constant/action';

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
        money: 0,
      };
      const { insertId } = await userModel.addNewUser(user);
      sign = Object.assign({}, user);
      sign.id = insertId;
      delete sign.money;
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
    delete userInfo.money;
    let id;
    let action = 'create';
    if (user && user.length) {
      if (user[0].status !== 2) {
        return {
          error: 'User email or phone number has registed',
          status: 400,
        };
      } else {
        id = user[0].id.toString();
        await userModel.updateUser(id, userInfo);
        action = 'update';
      }
    } else {
      const { insertId } = await userModel.addNewUser(userInfo);
      userInfo.money = 0;
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
    const serverNotify = await rabbitSender(`user.${action}`, { id: id.toString(), body: userInfo });
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
    delete userInfo.money;
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

async function recharge(id, money) {
  try {
    const user = await userModel.getById(id);
    if (!user || !user.length || !user[0].status) {
      return {
        error: 'User does not exists',
        status: 400,
      };
    }
    const moneyAfterRecharge = parseInt(money) + parseInt(user[0].money);
    const docModel = new Document();
    const res = await Promise.all([
      docModel.purchase({
        userId: id,
        action: action.RECHARGE,
        money,
      }),
      userModel.updateUser(id, { money: moneyAfterRecharge }),
    ]);

    const serverNotify = await rabbitSender('purchase.create', {
      id: res[0].insertId,
      body: {
        userId: id,
        userName: user[0].name,
        money,
        action: action.RECHARGE,
      },
    });

    if (serverNotify.statusCode === 200) {
      return {
        status: 200,
        message: `Your money: ${moneyAfterRecharge}`,
      };
    } else {
      // HERE IS CASE API QUERY iS NOT RESOLVED
      // TODO: ROLLBACK HERE
      logger.error(`[PURCHASE]: ${serverNotify.error}`);

      return {
        status: serverNotify.statusCode,
        message: serverNotify.error,
      };
    }

  } catch (ex) {
    logger.error(ex.error || ex.message || 'Unexpected error when recharge money');

    return exception;
  }
}

export { recharge, auth, addUser, getAllUsers, deleteUser, updateUser, blockUser };