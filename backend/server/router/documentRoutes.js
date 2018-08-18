import express from 'express';
import multer from 'multer';
import {
  getListDocuments,
  uploadDocument,
  getDocument,
  updateDocumentInfo,
  viewContent,
  deleteDocument,
} from '../../src/controller/document';

const routerDefine =  function defineRouter() {
  // Destination folder path
  const pathDesFolder = process.env.PATH_DES_FOLDER || '/tmp/';
  const uploader = multer({ dest: pathDesFolder });
  const route = express.Router();

  // Get all documents
  route.get('/documents', async (req, res) => {
    const result = await getListDocuments(req.query);
    res.status(200).json({
      data: result,
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

  route.get('/documents/:fileName/view', async (req, res) => {
    const { error, filePath, status } = await viewContent(req.params.fileName);
    if (error) {
      return res.status(status || 500).json({
        error,
      });
    }
    res.setHeader('Content-Type', `application/${filePath.split('.').pop()}`);
    res.status(status || 200).sendFile(filePath);
  });
  // Upload
  route.post('/documents', uploader.any(), async (req, res) => {
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

  return route;
};

export default routerDefine;