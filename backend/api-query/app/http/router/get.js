import express from 'express';
import fs from 'fs-extra';
import { isUndefined } from 'util';
import documentHandler from '../../src/handlers/documents';
import categoryHandler from '../../src/handlers/category';
import userHandler from '../../src/handlers/user';
import classHandler from '../../src/handlers/class';
import collectionHandler from '../../src/handlers/collection';
import subjectHandler from '../../src/handlers/subject';
import tagHandler from '../../src/handlers/tag';
import purchaseHandler from '../../src/handlers/purchase';
import newsHandler from '../../src/handlers/news';
import downloadHandler from '../../src/handlers/download';
import comment from '../../src/handlers/comment';

const routerDefine =  function defineRouter() {
  // Destination folder path
  const route = express.Router();

  route.get('/tags', async (req, res) => {
    const queryParams = req.query;
    const { statusCode, error, data, total } = await tagHandler.getList(queryParams);
    res.status(statusCode);
    if (error) {
      res.json({ statusCode, error });
    } else {
      res.json({ statusCode, data, total });
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

  route.get('/documents/:id/preview', async (req, res) => {
    const { id } = req.params;

    const { statusCode, error, filePreview } = await documentHandler.getPreview(id);
    if (error) {
      res.json({ statusCode, error });
    } else {
      try {
        const lsPromises = filePreview.map((img) => {
          return fs.readFile(img, { encoding: 'base64' });
        });
        const lsBuffers = await Promise.all(lsPromises);
        res.send(lsBuffers);
      } catch (err) {
        res.send({ statusCode: 500, error: err.message });
      }
    }
  });

  route.get('/purchase', async (req, res) => {
    const { statusCode, error, data, total } = await purchaseHandler.getList(req.query);
    res.status(statusCode);
    if (error) {
      res.json({ statusCode, error });
    } else {
      res.json({ statusCode, data, total });
    }
  });

  route.get('/news', async (req, res) => {
    const queryParams = req.query;

    const { statusCode, error, data, total, scrollId, isLastPage } = isUndefined(req.query.scrollId) ?
      await newsHandler.getList(queryParams) :
      await newsHandler.getNextPage(req.query.scrollId);
    res.status(statusCode !== 204 ? statusCode : 200);
    if (error) {
      res.json({ statusCode, error });
    } else {
      res.json({ statusCode, data, total, scrollId, isLastPage });
    }
  });

  route.get('/news/:id', async (req, res) => {
    const { id } = req.params;
    const { statusCode, error, data } = await newsHandler.getOne(id);
    res.status(statusCode);
    if (error) {
      res.json({ statusCode, error });
    } else {
      res.json({ statusCode, data });
    }
  });

  route.get('/download', async (req, res) => {
    const queryParams = req.query;

    const { statusCode, error, data, total, scrollId, isLastPage } = isUndefined(req.query.scrollId) ?
      await downloadHandler.getList(queryParams) :
      await downloadHandler.getNextPage(req.query.scrollId);
    res.status(statusCode !== 204 ? statusCode : 200);
    if (error) {
      res.json({ statusCode, error });
    } else {
      res.json({ statusCode, data, total, scrollId, isLastPage });
    }
  });

  route.get('/comments', async (req, res) => {
    const queryParams = req.query;

    const { statusCode, error, data, total, scrollId, isLastPage } = isUndefined(req.query.scrollId) ?
      await comment.getList(queryParams) :
      await comment.getNextPage(req.query.scrollId);
    res.status(statusCode !== 204 ? statusCode : 200);
    if (error) {
      res.json({ statusCode, error });
    } else {
      res.json({ statusCode, data, total, scrollId, isLastPage });
    }
  });

  return route;
};

export default routerDefine;