import express from 'express';
import {
  createSubject,
  deleteSubjectById,
  updateSubject,
} from '../../src/controller/subject';

const routerDefine =  function defineRouter() {
  // Destination folder path
  const route = express.Router();

  route.post('/subjects', async (req, res) => {
    req.body.userId = req.app.locals.id.toString();
    const { error, message, status } = await createSubject(req.body);
    if (!error) {
      return res.status(status || 201).json({
        message,
      });
    }

    return res.status(status || 500).json({
      error,
    });
  });

  route.put('/subjects/:id', async (req, res) => {
    req.body.userId = req.app.locals.id.toString();
    const { error, message, status } = await updateSubject(req.params.id, req.body);
    if (error) {
      return res.status(status).json({
        error,
      });
    }
    res.status(status).json({
      data: message,
    });
  });

  route.delete('/subjects/:id', async (req, res) => {
    const userId = req.app.locals.id.toString();
    const { error, message, status } = await deleteSubjectById(req.params.id, userId);
    if (error) {
      return res.status(status || 500).json({ error });
    }

    res.status(status || 200).json({ message });
  });

  return route;
};

export default routerDefine;