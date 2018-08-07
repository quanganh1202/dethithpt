import express from 'express';
import { tokenGenerator } from '../middleware/jwt';
import { login, auth, addUser, getAllUsers } from '../../src/controller/user';

const routerDefine =  function defineRouter() {
  const route = express.Router();

  route.post('/login', async (req, res) => {
    const { userName, password } = req.body;
    const { token, error } = await login(userName, password);
    if (token) {
      res.status(200).json({
        token,
      });
    } else {
      res.status(error.status || 401).json({
        error,
      });
    }
  });

  route.post('/login/auth/facebook', async (req, res) => {
    const { email } = req.body;
    const { token, error } = await auth(email);
    if (token) {
      res.status(200).json({
        token,
      });
    } else {
      res.status(error.status || 401).json({
        error,
      });
    }
  });

  route.post('/register', async (req, res) => {
    const userInfo = req.body;
    const { error, status } = await addUser(userInfo);

    if (error) {
      res.status(status || 500).json({
        error: error || 'Unexpected error',
      });
    } else {
      const sign = {
        role: userInfo.email,
      };
      const { token, expiresIn } = tokenGenerator(sign);
      res.status(status || 201).json({
        data: 'Has registered',
        token,
        expiresIn,
      });
    }
  });

  route.get('/users', async (req, res) => {
    const users = await getAllUsers();

    res.json(users);
  });

  return route;
};

export default routerDefine;