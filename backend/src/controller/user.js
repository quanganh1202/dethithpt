import User from '../model/user';
import { tokenGenerator }  from '../../server/middleware/jwt';
import logger from '../libs/logger';
import { dataValidator } from '../libs/ajv';

const userModel = new User();
const schemaId = 'http://dethithpt.com/user-schema#';

async function auth(info) {
  try {
    const { email, phone } = info;
    const criteria = [{ email }, { phone }];
    const user = await userModel.getList(criteria);
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

    if (user && user.length) {

      return {
        error: 'User account already existed',
        status: 400,
      };
    }
    await userModel.addNewUser(userInfo);

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