import express from 'express';
import multer from 'multer';
import {
  getListDocuments,
  uploadDocument,
  getDocument,
  updateDocumentInfo,
  deleteDocument,
  purchaseDocument,
  downloadDocument,
} from '../../src/controller/document';
import { isUndefined } from 'util';

const routerDefine =  function defineRouter() {
  // Destination folder path
  const pathDesFolder = process.env.PATH_DES_FOLDER || '/tmp/';
  const uploader = multer({ dest: pathDesFolder });
  const route = express.Router();

  // Get all documents
  route.get('/documents', async (req, res) => {
    const { docs, status, total } = await getListDocuments(req.query);
    res.status(status || 200).json({
      data: docs,
      total,
    });
  });
  // Get one
  route.get('/documents/:id', async (req, res) => {
    const { error, data, status } = await getDocument(req.params.id, req.query.cols);
    if (error)
      return res.status(status || 500).json({
        error,
      });

    res.status(status || 200).json({
      data,
    });
  });
  // Upload
  route.post('/documents', uploader.any(), async (req, res) => {
    req.body.userId = req.app.locals.id.toString();
    const { error, message, status } = await uploadDocument(req.body, req.files);
    if (!error) {
      return res.status(status || 201).json({
        message,
      });
    }

    return res.status(status || 500).json({
      error,
    });
  });
  // Update documents
  route.post('/documents/:id', uploader.any(), async (req, res) => {
    const { error, message, status } = await updateDocumentInfo(req.params.id, req.body, req.files);
    if (error) {
      return res.status(status).json({
        error,
      });
    }
    res.status(status).json({
      data: message,
    });
  });
  // Delete documents
  route.delete('/documents/:id', async (req, res) => {
    const { error, message, status } = await deleteDocument(req.params.id);
    if (error) {
      return res.status(status || 500).json({ error });
    }

    res.status(status || 200).json({ message });
  });

  route.post('/download/:docId', async (req, res) => {
    const userId = req.app.locals.id.toString();
    const docId = req.params.docId;
    const download = req.query.download;
    const { error, status, path } = await downloadDocument(docId, userId);
    if (error) {
      return res.status(status).json({
        error,
      });
    }
    if (isUndefined(download)) {
      return res.status(status).json({
        message: 'OK',
      });
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.status(status).download(path);
  });

  route.post('/documents/:id/purchase', async (req, res) => {
    const userId = req.app.locals.id.toString();
    const docId = req.params.id;
    const { error, status, message } = await purchaseDocument(docId, userId);
    if (error) {
      return res.status(status).json({
        error,
      });
    }
    res.status(status).json({
      data: message,
    });
  });

  return route;
};

export default routerDefine;