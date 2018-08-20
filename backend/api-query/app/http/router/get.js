import express from 'express';
import documentHandler from '../../src/handlers/documents';

const routerDefine =  function defineRouter() {
  // Destination folder path
  const route = express.Router();

  route.get('/documents/:id', async (req, res) => {
    const { id } = req.params;
    const { statusCode, error, data } = await documentHandler.getDocumentById(id);
    res.status(statusCode);
    if (error) {
      res.json({ statusCode, error });
    } else {
      res.json({ statusCode, data });
    }
  });

  route.get('/documents', async (req, res) => {
    const queryParams = req.query;

    const { statusCode, error, data, totalSize } = await documentHandler.getDocuments(queryParams);
    res.status(statusCode);
    if (error) {
      res.json({ statusCode, error });
    } else {
      res.json({ statusCode, data, totalSize });
    }
  });

  return route;
};

export default routerDefine;