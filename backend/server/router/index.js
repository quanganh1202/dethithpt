import express from 'express';
import { login } from '../../src/controller/user';

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

  return route;
};

export default routerDefine;