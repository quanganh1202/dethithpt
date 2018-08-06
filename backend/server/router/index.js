import express from 'express';
import { tokenGenerator } from '../middleware/jwt';
import User from '../../src/controller/user';

const routerDefine =  function defineRouter() {
  const route = express.Router();

  route.post('/login', (req, res) => {
    const { userName, password } = req.body;
    const user = new User();
    const auth = user.login(userName, password);
    if (auth) {
      const token = tokenGenerator(userName);

      res.status(200).json({
        token,
      });
    } else {
      res.status(401).json({
        error: 'Unauthorize',
      });
    }
  });

  return route;
};

export default routerDefine;