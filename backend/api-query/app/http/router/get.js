import express from 'express';
import { isUndefined } from 'util';
import documentHandler from '../../src/handlers/documents';
import trackingHandler from '../../src/handlers/tradingHistories';
import commonHandler from '../../src/handlers/common';
import cateDocRefHandler from '../../src/handlers/cateDoc';
import categoryHandler from '../../src/handlers/category';

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

    const { statusCode, error, data, total, scrollId, isLastPage } = isUndefined(req.query.scrollId) ?
      await documentHandler.getList(queryParams) :
      await documentHandler.getNextPage(req.query.scrollId);
    res.status(statusCode !== 204 ? statusCode : 200);
    if (error) {
      res.json({ statusCode, error });
    } else {
      res.json({ statusCode, data, total, scrollId, isLastPage });
    }
  });

  route.get('/histories/:userId', async (req, res) => {
    const queryParams = req.query;
    const { userId } = req.params;

    const { statusCode, error, data, total, scrollId, isLastPage } = await trackingHandler.getList(userId, queryParams);

    res.status(statusCode !== 204 ? statusCode : 200);
    if (error) {
      res.json({ statusCode, error });
    } else {
      res.json({ statusCode, data, total, scrollId, isLastPage });
    }
  });

  route.get('/income/:userId', async (req, res) => {
    const { userId } = req.params;
    const { statusCode, error, data } = await trackingHandler.getIncome(userId);
    res.status(statusCode !== 204 ? statusCode : 200);
    if (error) {
      res.json({ statusCode, error });
    } else {
      res.json({ statusCode, data });
    }
  });

  route.get('/categories', async (req, res) => {
    const queryParams = req.query;

    const { statusCode, error, data, total, scrollId, isLastPage } = isUndefined(req.query.scrollId) ?
      await categoryHandler.getList(queryParams) :
      await categoryHandler.getNextPage(req.query.scrollId);
    res.status(statusCode !== 204 ? statusCode : 200);
    if (error) {
      res.json({ statusCode, error });
    } else {
      res.json({ statusCode, data, total, scrollId, isLastPage });
    }
  });

  route.get('/categories/:id', async (req, res) => {
    const { id } = req.params;
    const { statusCode, error, data } = await categoryHandler.getOne(id);
    res.status(statusCode);
    if (error) {
      res.json({ statusCode, error });
    } else {
      res.json({ statusCode, data });
    }
  });

  route.get('/categories/aggregation', async (req, res) => {
    const { statusCode, error, aggs } = await cateDocRefHandler.getAggs();
    if (error) {
      res.json({ statusCode, error });
    } else {
      res.json({ statusCode, data: aggs });
    }
  });

  return route;
};

export default routerDefine;