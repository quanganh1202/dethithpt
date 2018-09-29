import express from 'express';
import {
  createCollection,
  deleteCollectionById,
  getCollectionById,
  getListCollections,
  updateCollection,
} from '../../src/controller/collection';

const routerDefine =  function defineRouter() {
  // Destination folder path
  const route = express.Router();

  route.get('/collections', async (req, res) => {
    const result = await getListCollections(req.query);
    res.status(200).json({
      data: result,
    });
  });

  route.get('/collections/:id', async (req, res) => {
    const { error, data, status } = await getCollectionById(req.params.id, req.query.cols);
    if (error)
      return res.status(status || 500).json({
        statusCode: status,
        error,
      });

    res.status(status || 200).json({
      statusCode: status,
      data,
    });
  });

  route.post('/collections', async (req, res) => {
    req.body.userId = req.app.locals.id.toString();
    const { error, message, status } = await createCollection(req.body);
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

  route.put('/collections/:id', async (req, res) => {
    req.body.userId = req.app.locals.id.toString();
    const { error, message, status } = await updateCollection(req.params.id, req.body);
    if (error) {
      return res.status(status).json({
        error,
      });
    }
    res.status(status).json({
      data: message,
    });
  });

  route.delete('/collections/:id', async (req, res) => {
    const userId = req.app.locals.id.toString();
    const { error, message, status } = await deleteCollectionById(req.params.id, userId);
    if (error) {
      return res.status(status || 500).json({ error });
    }

    res.status(status || 200).json({ statusCode: status, message });
  });

  return route;
};

export default routerDefine;