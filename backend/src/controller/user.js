import User from '../model/user';
import { tokenGenerator }  from '../../server/middleware/jwt';
import logger from '../libs/logger';
import { dataValidator } from '../libs/ajv';
import request from 'request-promise';

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
    }
    sign = user[0];
    const { token, expiresIn } = tokenGenerator(sign);

    return {
      status: 200,
      token,
      expiresIn,
    };
  } catch (ex) {
    logger.error(ex.message || 'Unexpected error when auth');

    return {
      error: 'Unexpected error',
      status: 500,
    };
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
    };
  } catch (ex) {
    logger.error(ex.message || 'Unexpected error when insert an user');

    return {
      error: 'Unexpected error',
      status: 500,
    };
  }
}

async function getAllUsers() {
  const users = await userModel.getList();

  return users;
}

export { auth, addUser, getAllUsers };