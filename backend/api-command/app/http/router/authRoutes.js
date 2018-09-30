import express from 'express';
import { auth, addUser, getAllUsers, deleteUser, updateUser, blockUser, recharge } from '../../src/controller/user';

const routerDefine =  function defineRouter() {
  // Destination folder path
  const route = express.Router();

  route.post('/login', async (req, res) => {
    const { token, expiresIn, error, status } = await auth(req.body);
    if (error) {
      res.status(error.status || 401).json({
        error,
        statusCode: status,
      });
    } else {
      res.status(200).json({
        token,
        expiresIn,
        statusCode: status,
      });
    }
  });

  route.post('/register', async (req, res) => {
    const userInfo = req.body;
    const { error, status, token, expiresIn } = await addUser(userInfo);

    if (error) {
      return res.status(status || 500).json({
        error: error || 'Unexpected error',
      });
    }
    res.status(status || 201).json({
      token,
      expiresIn,
      statusCode: status,
    });
  });

  route.get('/users', async (req, res) => {
    const users = await getAllUsers();

    res.status(200).json({
      data: users,
    });
  });

  route.delete('/users/:id', async (req, res) => {
    const userId = req.app.locals.id.toString();
    const { error, message, status } = await deleteUser(req.params.id, userId);
    res.status(status);
    if (error) {
      return res.json({ statusCode: status, error });
    }

    res.json({ statusCode: status, message });
  });

  route.put('/users/:id', async (req, res) => {
    req.body.userId = req.app.locals.id.toString();
    const { error, message, status } = await updateUser(req.params.id, req.body);
    res.status(status);
    if (error) {
      return res.json({ statusCode: status, error });
    }

    res.json({ statusCode: status, message });
  });

  route.put('/users/:id/block', async (req, res) => {
    const userId = req.app.locals.id.toString();
    const { id } = req.params;
    const { error, message, status } = await blockUser(id, userId, req.body);
    res.status(status);
    if (error) {
      return res.json({ statusCode: status, error });
    }

    res.json({ statusCode: status, message });
  });

  route.post('/users/recharge', async (req, res) => {
    const userId = req.app.locals.id.toString();
    const { money } = req.body;
    if (!/^[0-9]+$/.test(money)) {
      res.status(400).json({
        statusCode: 400,
        error: 'Money must be a number',
      });
    }

    const { error, status, message } = await recharge(userId, money || 0);
    res.status(status);
    if (error) {
      return res.json({ statusCode: status, error });
    }

    res.json({ statusCode: status, message });
  });

  return route;
};

export default routerDefine;