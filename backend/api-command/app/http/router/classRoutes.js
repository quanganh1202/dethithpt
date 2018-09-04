import express from 'express';
import {
  createClass,
  deleteClassById,
  getClassById,
  getListClasses,
  updateClass,
} from '../../src/controller/class';

const routerDefine =  function defineRouter() {
  // Destination folder path
  const route = express.Router();

  route.get('/classes', async (req, res) => {
    const result = await getListClasses(req.query);
    res.status(200).json({
      data: result,
    });
  });

  route.get('/classes/:id', async (req, res) => {
    const { error, data, status } = await getClassById(req.params.id, req.query.cols);
    if (error)
      return res.status(status || 500).json({
        error,
      });

    res.status(status || 200).json({
      data,
    });
  });

  route.post('/classes', async (req, res) => {
    req.body.userId = req.app.locals.id.toString();
    const { error, message, status } = await createClass(req.body);
    if (!error) {
      return res.status(status || 201).json({
        message,
      });
    }

    return res.status(status || 500).json({
      error,
    });
  });

  route.put('/classes/:id', async (req, res) => {
    const { error, message, status } = await updateClass(req.params.id, req.body);
    if (error) {
      return res.status(status).json({
        error,
      });
    }
    res.status(status).json({
      data: message,
    });
  });

  route.delete('/classes/:id', async (req, res) => {
    const { error, message, status } = await deleteClassById(req.params.id);
    if (error) {
      return res.status(status || 500).json({ error });
    }

    res.status(status || 200).json({ message });
  });

  return route;
};

export default routerDefine;