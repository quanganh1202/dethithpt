import express from 'express';
import {
  createComment,
  updateComment,
  deleteComment,
} from '../../src/controller/comment';

const routerDefine =  function defineRouter() {
  // Destination folder path
  const route = express.Router();

  route.post('/comments', async (req, res) => {
    req.body.userId = req.app.locals.id.toString();
    const { error, message, status } = await createComment(req.body);
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

  route.put('/comments/:id', async (req, res) => {
    req.body.userId = req.app.locals.id.toString();
    const { error, message, status } = await updateComment(req.params.id, req.body);
    if (error) {
      return res.status(status).json({
        error,
      });
    }
    res.status(status).json({
      data: message,
    });
  });

  route.delete('/comments/:id', async (req, res) => {
    const userId = req.app.locals.id.toString();
    const { error, message, status } = await deleteComment(req.params.id, userId);
    if (error) {
      return res.status(status || 500).json({ error });
    }

    res.status(status || 200).json({ statusCode: status, message });
  });

  return route;
};

export default routerDefine;