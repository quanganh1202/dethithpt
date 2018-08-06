import express from 'express';
import { tokenGenerator } from '../middleware/jwt';

const routerDefine =  function defineRouter() {
  const route = express.Router();

  route.post('/login', (req, res) => {
    const { userName } = req.body;
    const token = tokenGenerator(userName);

    res.status(200).json({
      token,
    });
  });

  return route;
};

export default routerDefine;