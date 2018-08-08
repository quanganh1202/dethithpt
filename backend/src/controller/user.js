import User from '../model/user';
import { tokenGenerator }  from '../../server/middleware/jwt';
import { encryptor, descryptor } from '../libs/encrypt';

const userModel = new User();

async function login(userName, pwd) {
  try {
    const user = await userModel.getList({
      userName,
    });

    const auth = await descryptor(pwd, user[0].password);

    if (user.length && auth) {
      const token = tokenGenerator();

      return { token };
    }

    return {
      error: 'Unauthorize',
      status: 401,
    };
  } catch (ex) {
    return {
      error: 'Unexpected error',
      status: 500,
    };
  }
}

async function auth(email) {
  try {
    const criteria = { email };
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
    else return {
      error: 'Unauthorize',
      status: 401,
    };
  } catch (ex) {
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
    userInfo.password = await encryptor(userInfo.password);
    await userModel.addNewUser(userInfo);

    return {
      status: 201,
    };
  } catch (ex) {
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

export { login, auth, addUser, getAllUsers };