import express from 'express';
import {
  createClass,
  deleteClassById,
  updateClass,
} from '../../src/controller/class';

const routerDefine =  function defineRouter() {
  // Destination folder path
  const route = express.Router();

  route.post('/classes', async (req, res) => {
    req.body.userId = req.app.locals.id.toString();
    const { error, message, status } = await createClass(req.body);
    if (!error) {
      return res.status(status || 201).json({
        statusCode: status,
        message,
      });
    }

    return res.status(status || 500).json({
      statusCode: status,
      error,
    });
  });

  route.put('/classes/:id', async (req, res) => {
    req.body.userId = req.app.locals.id.toString();
    const { error, message, status } = await updateClass(req.params.id, req.body);
    if (error) {
      return res.status(status).json({
        statusCode: status,
        error,
      });
    }
    res.status(status).json({
      statusCode: status,
      data: message,
    });
  });

  route.delete('/classes/:id', async (req, res) => {
    const userId = req.app.locals.id.toString();
    const { error, message, status } = await deleteClassById(req.params.id, userId);
    if (error) {
      return res.status(status || 500).json({ statusCode: status, error });
    }

    res.status(status || 200).json({ statusCode: status, message });
  });

  return route;
};

export default routerDefine;