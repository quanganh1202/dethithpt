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

export { login };