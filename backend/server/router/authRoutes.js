import express from 'express';
import { tokenGenerator } from '../middleware/jwt';
import { auth, addUser, getAllUsers } from '../../src/controller/user';

const routerDefine =  function defineRouter() {
  // Destination folder path
  const route = express.Router();

  route.post('/login', async (req, res) => {
    const { token, expiresIn, error } = await auth(req.body);
    if (error) {
      res.status(error.status || 401).json({
        error,
      });
    } else {
      res.status(200).json({
        token,
        expiresIn,
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
        message: 'Has registered',
        token,
        expiresIn,
      });
    }
  });

  route.get('/users', async (req, res) => {
    const users = await getAllUsers();

    res.status(200).json({
      data: users,
    });
  });

  return route;
};

export default routerDefine;