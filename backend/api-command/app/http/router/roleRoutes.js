import express from 'express';
import {
  createRole,
  deleteRoleById,
  updateRole,
} from '../../src/controller/role';

const routerDefine =  function defineRouter() {
  // Destination folder path
  const route = express.Router();

  route.post('/roles', async (req, res) => {
    req.body.userId = req.app.locals.id.toString();
    const { error, message, status } = await createRole(req.body);
    if (!error) {
      return res.status(status || 201).json({
        message,
      });
    }

    return res.status(status || 500).json({
      error,
    });
  });

  route.put('/roles/:id', async (req, res) => {
    const { error, message, status } = await updateRole(req.params.id, req.body);
    if (error) {
      return res.status(status).json({
        error,
      });
    }
    res.status(status).json({
      data: message,
    });
  });

  route.delete('/roles/:id', async (req, res) => {
    const { error, message, status } = await deleteRoleById(req.params.id);
    if (error) {
      return res.status(status || 500).json({ error });
    }

    res.status(status || 200).json({ message });
  });

  return route;
};

export default routerDefine;