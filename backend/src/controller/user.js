import User from '../model/user';
import { tokenGenerator }  from '../../server/middleware/jwt';

const userModel = new User();

async function login(userName, pwd) {
  try {
    const user = await userModel.getList({
      userName,
      password: pwd,
    });

    if (user.length) {
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
    if (user && user.length) return tokenGenerator();
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