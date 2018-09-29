import express from 'express';
import {
  createCategory,
  deleteCategoryById,
  updateCategory,
} from '../../src/controller/category';

const routerDefine =  function defineRouter() {
  // Destination folder path
  const route = express.Router();

  route.post('/categories', async (req, res) => {
    req.body.userId = req.app.locals.id.toString();
    const { error, message, status } = await createCategory(req.body);
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

  route.put('/categories/:id', async (req, res) => {
    req.body.userId = req.app.locals.id.toString();
    const { error, message, status } = await updateCategory(req.params.id, req.body);
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

  route.delete('/categories/:id', async (req, res) => {
    const userId = req.app.locals.id.toString();
    const { error, message, status } = await deleteCategoryById(req.params.id, userId);
    if (error) {
      return res.status(status || 500).json({ statusCode: status, error });
    }

    res.status(status || 200).json({ statusCode: status, message });
  });

  return route;
};

export default routerDefine;