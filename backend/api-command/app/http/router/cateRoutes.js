import express from 'express';
import {
  createCategory,
  deleteCategoryById,
  getCategoryById,
  getListCategories,
  updateCategory,
} from '../../src/controller/category';

const routerDefine =  function defineRouter() {
  // Destination folder path
  const route = express.Router();

  route.get('/categories', async (req, res) => {
    const result = await getListCategories(req.query);
    res.status(200).json({
      data: result,
    });
  });

  route.get('/categories/:id', async (req, res) => {
    const { error, data, status } = await getCategoryById(req.params.id, req.query.cols);
    if (error)
      return res.status(status || 500).json({
        error,
      });

    res.status(status || 200).json({
      data,
    });
  });

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
    const { error, message, status } = await deleteCategoryById(req.params.id);
    if (error) {
      return res.status(status || 500).json({ statusCode: status, error });
    }

    res.status(status || 200).json({ statusCode: status, message });
  });

  return route;
};

export default routerDefine;