import express from 'express';
import { auth, addUser, getAllUsers, deleteUser, updateUser, blockUser } from '../../src/controller/user';

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
    const { error, message, status } = await deleteUser(req.params.id);
    res.status(status);
    if (error) {
      return res.json({ statusCode: status, error });
    }

    res.json({ statusCode: status, message });
  });

  route.put('/users/:id', async (req, res) => {
    const { error, message, status } = await updateUser(req.params.id, req.body);
    res.status(status);
    if (error) {
      return res.json({ statusCode: status, error });
    }

    res.json({ statusCode: status, message });
  });

  route.put('/users/:id/block', async (req, res) => {
    const { error, message, status } = await blockUser(req.params.id);
    res.status(status);
    if (error) {
      return res.json({ statusCode: status, error });
    }

    res.json({ statusCode: status, message });
  });

  return route;
};

export default routerDefine;