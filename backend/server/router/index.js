import express from 'express';
import multer from 'multer';
import { tokenGenerator } from '../middleware/jwt';
import { auth, addUser, getAllUsers } from '../../src/controller/user';
import {
  getListDocuments,
  uploadDocument,
  getDocument,
  updateDocumentInfo,
  viewContent,
} from '../../src/controller/document';

const routerDefine =  function defineRouter() {
  // Destination folder path
  const pathDesFolder = process.env.PATH_DES_FOLDER || '/tmp/';
  const uploader = multer({ dest: pathDesFolder });
  const route = express.Router();

  route.post('/login', async (req, res) => {
    const { token, expiresIn, error } = await auth(req.body);
    if (error) {
      res.status(error.status || 401).json({
        error,
      });
    } else {
      res.status(200).json({
        token,
        expiresIn,
      });
    }
  });

  route.post('/register', async (req, res) => {
    const userInfo = req.body;
    const { error, status } = await addUser(userInfo);

    if (error) {
      res.status(status || 500).json({
        error: error || 'Unexpected error',
      });
    } else {
      const sign = {
        role: userInfo.email,
      };
      const { token, expiresIn } = tokenGenerator(sign);
      res.status(status || 201).json({
        message: 'Has registered',
        token,
        expiresIn,
      });
    }
  });

  route.get('/users', async (req, res) => {
    const users = await getAllUsers();

    res.status(200).json({
      data: users,
    });
  });

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

  route.get('/documents/view/:fileName', async (req, res) => {
    const { error, filePath, status } = await viewContent(req.params.fileName);
    if (error) {
      return res.status(status || 500).json({
        error,
      });
    }
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
  route.put('/documents/:id', async (req, res) => {
    const { error, message, status } = await updateDocumentInfo(req.params.id, req.body);
    if (error) {
      return res.status(status).json({
        message,
      });
    }
    res.status(status).json({
      data: message,
    });
  });
  // Delete documents
  route.delete('/docuents/:id');

  return route;
};

export default routerDefine;