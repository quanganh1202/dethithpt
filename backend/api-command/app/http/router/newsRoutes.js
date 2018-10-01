import express from 'express';
import {
  createNews,
  deleteNewsById,
  updateNews,
} from '../../src/controller/news';

const routerDefine =  function defineRouter() {
  // Destination folder path
  const route = express.Router();

  route.post('/news', async (req, res) => {
    req.body.userId = req.app.locals.id.toString();
    const { error, message, status } = await createNews(req.body);
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

  route.put('/news/:id', async (req, res) => {
    req.body.userId = req.app.locals.id.toString();
    const { error, message, status } = await updateNews(req.params.id, req.body);
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

  route.delete('/news/:id', async (req, res) => {
    const userId = req.app.locals.id.toString();
    const { error, message, status } = await deleteNewsById(req.params.id, userId);
    if (error) {
      return res.status(status || 500).json({ statusCode: status, error });
    }

    res.status(status || 200).json({ statusCode: status, message });
  });

  return route;
};

export default routerDefine;