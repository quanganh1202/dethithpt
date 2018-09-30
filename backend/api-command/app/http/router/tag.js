import express from 'express';
import {
  updateTag,
} from '../../src/controller/tag';

const routerDefine =  function defineRouter() {
  // Destination folder path
  const route = express.Router();

  // Get all documents
  route.put('/tags/:id', async (req, res) => {
    req.body.userId = req.app.locals.id.toString();
    const { error, status, message } = await updateTag(req.params.id, req.body);
    res.status(status || 200);
    if(error) {
      return res.json({ error });
    }
    res.json({
      message,
    });
  });

  return route;
};

export default routerDefine;