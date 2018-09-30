import request from 'request-promise';
import User from '../model/user';
import Document from '../model/document';
import { tokenGenerator }  from '../../http/middleware/jwt';
import logger from '../libs/logger';
import { dataValidator } from '../libs/ajv';
import { exception } from '../constant/error';
import social from '../constant/socialApiUrl';
import rabbitSender from '../../rabbit/sender';
import * as roles from '../constant/roles';
import action from '../constant/action';

const userModel = new User();
const createSchema = 'http://dethithpt.com/user-create-schema#';
const updateSchema = 'http://dethithpt.com/user-update-schema#';

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
      const serverNotify = await rabbitSender('user.create', { id: insertId, body: user });
      sign.id = insertId;
      delete sign.money;
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
    const resValidate = dataValidator(userInfo, createSchema);
    if (!resValidate.valid) {
      return {
        status: 403,
        error: resValidate.errors,
      };
    }
    const { name, email, phone } = userInfo;
    const criteria = [ { email }, { phone }];
    // Temporary data. Need to remove after.
    if (email === 'vuanhdung.khmt2k7@gmail.com') {
      userInfo.role = roles.ADMIN;
    }
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
        id = user[0].id;
        await userModel.updateUser(id, userInfo);
        action = 'update';
      }
    } else {
      userInfo.money = 0;
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
    const serverNotify = await rabbitSender(`user.${action}`, { id, body: userInfo });
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

async function deleteUser(id, userId) {
  try {
    const userModel = new User();
    const user = await userModel.getById(userId);
    if (!user || !user.length || !user[0].status) {
      return {
        status: 400,
        error: 'User id does not exists',
      };
    }
    if (id !== userId && user[0].role !== roles.ADMIN) {
      return {
        status: 403,
        error: 'Forbidden',
      };
    }
    await userModel.deleteUser(id);
    const serverNotify = await rabbitSender('user.delete', { id });
    if (!serverNotify.error) {
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
    const resValidate = dataValidator(userInfo, updateSchema);
    if (!resValidate.valid) {
      return {
        status: 403,
        error: resValidate.errors,
      };
    }
    const { email, phone, userId } = userInfo;
    const existed = await userModel.getById(userId);
    if (!existed || !existed.length) {
      return {
        status: 400,
        error: 'User not found',
      };
    }
    const { role } = existed[0];
    if ((userId !== id || userInfo.role === roles.ADMIN) && role !== roles.ADMIN) {
      return {
        status: 403,
        error: 'Forbidden',
      };
    }
    if (email && role !== roles.ADMIN) {
      return {
        status: 400,
        error: 'Can not update email',
      };
    }
    const criteria = [ { email }, { phone }];
    const user = await userModel.getList(criteria);

    if (user && user.length && role === roles.ADMIN && ((phone && phone !== existed[0].phone) || (email && email !== existed[0].email))) {
      if  (email && email !== existed[0].email) {
        return {
          error: 'Email has been used by another people',
          status: 400,
        };
      }
    }
    if (role !== roles.ADMIN) delete userInfo.money;
    delete userInfo.userId;
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
    logger.error(ex || 'Unexpected error when update user');

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