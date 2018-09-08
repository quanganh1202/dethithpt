import express from 'express';
import { isUndefined } from 'util';
import documentHandler from '../../src/handlers/documents';
import trackingHandler from '../../src/handlers/tradingHistories';
import categoryHandler from '../../src/handlers/category';
import userHandler from '../../src/handlers/user';
import classHandler from '../../src/handlers/class';
import collectionHandler from '../../src/handlers/collection';
import subjectHandler from '../../src/handlers/subject';
import tagHandler from '../../src/handlers/tag';

const routerDefine =  function defineRouter() {
  // Destination folder path
  const route = express.Router();

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

  route.get('/users', async (req, res) => {
    const queryParams = req.query;

    const { statusCode, error, data, total, scrollId, isLastPage } = isUndefined(req.query.scrollId) ?
      await userHandler.getList(queryParams) :
      await userHandler.getNextPage(req.query.scrollId);
    res.status(statusCode !== 204 ? statusCode : 200);
    if (error) {
      res.json({ statusCode, error });
    } else {
      res.json({ statusCode, data, total, scrollId, isLastPage });
    }
  });

  route.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { statusCode, error, data } = await userHandler.getOne(id);
    res.status(statusCode);
    if (error) {
      res.json({ statusCode, error });
    } else {
      res.json({ statusCode, data });
    }
  });

  route.get('/classes', async (req, res) => {
    const queryParams = req.query;

    const { statusCode, error, data, total, scrollId, isLastPage } = isUndefined(req.query.scrollId) ?
      await classHandler.getList(queryParams) :
      await classHandler.getNextPage(req.query.scrollId);
    res.status(statusCode !== 204 ? statusCode : 200);
    if (error) {
      res.json({ statusCode, error });
    } else {
      res.json({ statusCode, data, total, scrollId, isLastPage });
    }
  });

  route.get('/classes/:id', async (req, res) => {
    const { id } = req.params;
    const { statusCode, error, data } = await classHandler.getOne(id);
    res.status(statusCode);
    if (error) {
      res.json({ statusCode, error });
    } else {
      res.json({ statusCode, data });
    }
  });

  route.get('/subjects', async (req, res) => {
    const queryParams = req.query;

    const { statusCode, error, data, total, scrollId, isLastPage } = isUndefined(req.query.scrollId) ?
      await subjectHandler.getList(queryParams) :
      await subjectHandler.getNextPage(req.query.scrollId);
    res.status(statusCode !== 204 ? statusCode : 200);
    if (error) {
      res.json({ statusCode, error });
    } else {
      res.json({ statusCode, data, total, scrollId, isLastPage });
    }
  });

  route.get('/subjects/:id', async (req, res) => {
    const { id } = req.params;
    const { statusCode, error, data } = await subjectHandler.getOne(id);
    res.status(statusCode);
    if (error) {
      res.json({ statusCode, error });
    } else {
      res.json({ statusCode, data });
    }
  });

  route.get('/collections', async (req, res) => {
    const queryParams = req.query;

    const { statusCode, error, data, total, scrollId, isLastPage } = isUndefined(req.query.scrollId) ?
      await collectionHandler.getList(queryParams) :
      await collectionHandler.getNextPage(req.query.scrollId);
    res.status(statusCode !== 204 ? statusCode : 200);
    if (error) {
      res.json({ statusCode, error });
    } else {
      res.json({ statusCode, data, total, scrollId, isLastPage });
    }
  });

  route.get('/collections/:id', async (req, res) => {
    const { id } = req.params;
    const { statusCode, error, data } = await collectionHandler.getOne(id);
    res.status(statusCode);
    if (error) {
      res.json({ statusCode, error });
    } else {
      res.json({ statusCode, data });
    }
  });

  route.get('/tags', async (req, res) => {
    const queryParams = req.query;
    const { statusCode, error, data, total } = await tagHandler.getList(queryParams);
    res.status(statusCode !== 204 ? statusCode : 200);
    if (error) {
      res.json({ statusCode, error });
    } else {
      res.json({ statusCode, data, total });
    }
  });

  return route;
};

export default routerDefine;