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
        error,
      });

    res.status(status || 200).json({
      data,
    });
  });

  route.post('/collections', async (req, res) => {
    req.body.userId = req.app.locals.id.toString();
    const { error, message, status } = await createCollection(req.body);
    if (!error) {
      return res.status(status || 201).json({
        message,
      });
    }

    return res.status(status || 500).json({
      error,
    });
  });

  route.put('/collections/:id', async (req, res) => {
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
    const { error, message, status } = await deleteCollectionById(req.params.id);
    if (error) {
      return res.status(status || 500).json({ error });
    }

    res.status(status || 200).json({ message });
  });

  return route;
};

export default routerDefine;