import User from '../model/user';
import { tokenGenerator }  from '../../server/middleware/jwt';
import logger from '../libs/logger';

const userModel = new User();

async function auth(info) {
  try {
    const { email, phone } = info;
    const criteria = email ? { email } : phone ? { phone } : undefined;
    const user = criteria ? await userModel.getList(criteria) : undefined;
    if (user && user.length) {
      const sign = { email };
      const { token, expiresIn } = tokenGenerator(sign);

      return {
        status: 200,
        token,
        expiresIn,
      };
    }
    else {
      return {
        error: 'Unauthorize',
        status: 401,
      };
    }
  } catch (ex) {
    logger.error(ex.message);

    return {
      error: 'Unexpected error when authenticate user',
      status: 500,
    };
  }
}

async function addUser(userInfo) {
  try {
    const { email } = userInfo;
    const user = await userModel.getList({ email });
    if (user && user.length) {

      return {
        error: 'User email already existed',
        status: 400,
      };
    }
    await userModel.addNewUser(userInfo);

    return {
      status: 201,
    };
  } catch (ex) {
    logger.error(ex.message);

    return {
      error: 'Unexpected error when insert an user',
      status: 500,
    };
  }
}

async function getAllUsers() {
  const users = await userModel.getList();

  return users;
}

export { auth, addUser, getAllUsers };