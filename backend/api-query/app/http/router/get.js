import express from 'express';
import documentHandler from '../../src/handlers/documents';
import commonHandler from '../../src/handlers/common';
import { isUndefined } from 'util';

const routerDefine =  function defineRouter() {
  // Destination folder path
  const route = express.Router();

  route.get('/totals', async(req, res) => {
    const { types } = req.query;

    const { statusCode, error, data } = await commonHandler.getTotals(types);
    res.status(statusCode);
    if (error) {
      res.json({ statusCode, error });
    } else {
      res.json({ statusCode, data });
    }
  });

  route.get('/documents/:id', async (req, res) => {
    const { id } = req.params;
    const { statusCode, error, data } = await documentHandler.getOne(id);
    res.status(statusCode);
    if (error) {
      res.json({ statusCode, error });
    } else {
      res.json({ statusCode, data });
    }
  });

  route.get('/documents', async (req, res) => {
    const queryParams = req.query;

    const { statusCode, error, data, totalSize, scrollId, isLastPage } = isUndefined(req.query.scrollId) ?
      await documentHandler.getList(queryParams) :
      await documentHandler.getNextPage(req.query.scrollId);
    res.status(statusCode !== 204 ? statusCode : 200);
    if (error) {
      res.json({ statusCode, error });
    } else {
      res.json({ statusCode, data, totalSize, scrollId, isLastPage });
    }
  });

  return route;
};

export default routerDefine;