import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import authRoutes from './router/authRoutes';
import documentRoutes from './router/documentRoutes';
import categoryRoutes from './router/cateRoutes';
import classRoutes from './router/classRoutes';
import subjectRoutes from './router/subjectRoutes';
import yearSchoolRoutes from './router/yearSchoolRoutes';
import collectionRoutes from './router/collectionRoutes';
import { tokenVerifier } from './middleware/jwt';
import logger from '../src/libs/logger';
import { addSchema } from '../src/libs/ajv';

const app = express();
const initialExpress = async function startServer() {
  const baseRoutePublic = process.env.BASE_ROUTE_PUBLIC || '';
  const baseRoutePrivate = process.env.BASE_ROUTE_PRIVATE || /^(?!.*(login|register)).*$/;
  const port = process.env.EXPRESS_PORT || 3000;
  app.use(cors()); // Allow cors
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());
  app.use(express.static(path.resolve(__dirname, './public')));
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Content-Type', 'application/json');
    next();
  });
  app.all(baseRoutePrivate, tokenVerifier);
  app.use(baseRoutePublic, [
    authRoutes(),
    documentRoutes(),
    categoryRoutes(),
    classRoutes(),
    subjectRoutes(),
    yearSchoolRoutes(),
    collectionRoutes(),
  ]);
  // Loading schema validation file in folder ./schema
  await addSchema();
  app.listen(port, () => {
    logger.info(`Server is running at ${port}`);
  });
};

export default initialExpress;
