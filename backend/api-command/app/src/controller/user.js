import request from 'request-promise';
import moment from 'moment';
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
import { isUndefined } from 'util';

const userModel = new User();
const createSchema = 'http://dethithpt.com/user-create-schema#';
const updateSchema = 'http://dethithpt.com/user-update-schema#';

const checkUserActivation = async (userId) => {
  const userModel = new User();
  const user = await userModel.getById(userId);
  if (!user || !user.length) {
    return {
      status: 400,
      error: 'User id does not exists',
    };
  }

  switch (user[0].status) {
  case 0:
    return {
      status: 400,
      error: 'Account has been blocked',
    };
  case 2:
    return {
      status: 400,
      error: 'You must be provide required infomation',
    };

  case 3:
    if (moment(user[0].blockFrom) <= moment.now()) {
      return {
        status: 400,
        error: `Account has been blocked from ${moment(user[0].blockFrom).format('YYYY-MM-DDTHH:mm:ss.SSS')}`,
      };
    }
    break;
  default:
    break;
  }

  return user;
};

async function auth(info, admin) {
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
        role: roles.MEMBER,
      };
      const { insertId } = await userModel.addNewUser(user);
      const serverNotify = await rabbitSender('user.create', { id: insertId, body: user });
      sign = Object.assign({}, user);
      sign.id = insertId;
      delete sign.role;
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

      if (!isUndefined(admin) && user[0].role !== roles.ADMIN) {
        return {
          status: 403,
          error: 'Forbidden: Only account admin can login to admin site',
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

async function addUser(userInfo, userId) {
  try {
    userInfo.role = roles.MEMBER; // Default role is member when register account
    const resValidate = dataValidator(userInfo, createSchema);
    if (!resValidate.valid) {
      return {
        status: 422,
        error: resValidate.errors,
      };
    }
    const actor = await userModel.getById(userId);
    if (!actor || !actor.length) {
      return {
        error: 'User email or phone not registed',
        status: 400,
      };
    }

    const { name, email, phone } = userInfo;
    if (actor[0].email !== email && actor[0].role !== roles.ADMIN) {
      return {
        error: 'Email in the token not match with email in the body',
        status: 400,
      };
    }

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
        id = user[0].id;
        const { role } = user[0];
        if (role) userInfo.role = role;
        await userModel.updateUser(id, userInfo);
        action = 'update';
        userInfo.numOfDownloaded = 0;
        userInfo.numOfUploaded = 0;
        userInfo.money = 0;
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
    const user = await checkUserActivation(userId);
    if (user.error) return user;
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
    const { email, phone, userId, notifyText, notifyStatus, status } = userInfo;
    const actor = await checkUserActivation(userId);
    if (actor.error) return actor;
    const existed = await userModel.getById(id);
    if (!existed || !existed.length) {
      return {
        status: 400,
        error: 'User not found',
      };
    }
    const { role } = actor[0];
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
    if (notifyText && role !== roles.ADMIN) {
      return {
        status: 400,
        error: 'Only role admin can update field notifyText',
      };
    }

    if (notifyText && isUndefined(notifyStatus)) {
      userInfo.notifyStatus = 1;
    }

    if (!isUndefined(status) && role !== roles.ADMIN) {
      return {
        status: 400,
        error: 'Only role admin can update field status',
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

/**
 * 0: Blocked
 * 1: Active
 * 2: Pending
 * 3: Block date
 * 4: Block download
 */

async function blockUser(id, userId, body) {
  try {
    const resValidate = dataValidator(body, 'http://dethithpt.com/block-schema#');
    if (!resValidate.valid) {
      return {
        status: 403,
        error: resValidate.errors,
      };
    }
    const actor = await checkUserActivation(userId);
    if (actor.error) return actor;
    if (actor[0].role !== roles.ADMIN) {
      return {
        status: 403,
        error: 'Forbidden',
      };
    }
    let user;
    let uid;
    const { email } = body;

    if (email) {
      user = await userModel.getList([{ email }]);
      if (user.length) {
        uid = user[0].id;
      }
    } else if (id) {
      user = await userModel.getById(id);
      uid = id;
    }
    if (!user || !user.length) {
      return {
        error: `User ${email || id} does not exist or blocked`,
        status: 400,
      };
    }
    if (actor[0].role !== roles.ADMIN) {
      return {
        error: 'Forbidden',
        status: 403,
      };
    }
    const {
      blockDownloadCollections,
      blockDownloadCategories,
      blockDownloadSubjects,
      blockFrom,
      status,
    } = body;
    const queryBody = Object.assign({}, body);
    switch (status) {
    case 3:
      if (!blockFrom) {
        return {
          status: 400,
          error: 'The start date of block should be provided',
        };
      }
      body.blockFrom = queryBody.blockFrom =
      blockFrom ? moment(blockFrom).format('YYYY-MM-DDTHH:mm:ss.SSS') : moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
      break;
    case 4:
      if (!blockDownloadCollections && !blockDownloadCategories && !blockDownloadSubjects) {
        return {
          status: 400,
          error: 'Should be provided block infomation. Ex: collections, categories ...',
        };
      }
      if (blockDownloadCollections) queryBody.blockDownloadCollections = blockDownloadCollections.split(',');
      if (blockDownloadCategories) queryBody.blockDownloadCategories = blockDownloadCategories.split(',');
      if (blockDownloadSubjects) queryBody.blockDownloadSubjects = blockDownloadSubjects.split(',');
      break;
    default:
      break;
    }

    await userModel.updateUser(uid, body);
    const serverNotify = await rabbitSender('user.update', { id: uid, body: queryBody });
    if (serverNotify.statusCode === 200) {
      return {
        status: 200,
        message: body.status.toString() !== '1' ? 'Blocked' : 'Activated',
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

async function recharge(userId, money) {
  try {
    const user = await checkUserActivation(userId);
    if (user.error) return user;
    const moneyAfterRecharge = parseInt(money) + parseInt(user[0].money);
    const docModel = new Document();
    const res = await Promise.all([
      docModel.purchase({
        userId: userId,
        action: action.RECHARGE,
        money,
      }),
      userModel.updateUser(userId, { money: moneyAfterRecharge }),
    ]);

    const serverNotify = await rabbitSender('purchase.create', {
      id: res[0].insertId,
      body: {
        userId,
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

async function bonus(userId, id, money, email) {
  try {
    const actor = await checkUserActivation(userId);
    if (actor.error) return actor;
    if (actor[0].role !== roles.ADMIN) return {
      status: 403,
      error: '[Forbidden] Bonus feature only available for admin',
    };
    let uid;
    let user;
    if (email) {
      user = await userModel.getList([{ email }]);
      if (user.length) {
        uid = user[0].id;
      }
    } else if (id) {
      user = await userModel.getById(id);
      uid = id;
    }
    if (!user || !user.length) {
      return {
        status: 400,
        error: `User ${email || id} does not existed`,
      };
    }
    const moneyAfterRecharge = parseInt(money) + parseInt(user[0].money);
    const docModel = new Document();
    const res = await Promise.all([
      docModel.purchase({
        userId: uid,
        action: action.BONUS,
        money,
      }),
      userModel.updateUser(userId, { money: moneyAfterRecharge }),
    ]);

    const serverNotify = await rabbitSender('purchase.create', {
      id: res[0].insertId,
      body: {
        userId: uid,
        userName: user[0].name,
        money,
        action: action.BONUS,
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

export { recharge, auth, addUser, getAllUsers, deleteUser, updateUser, blockUser, bonus };