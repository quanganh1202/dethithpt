import 'babel-polyfill';
import path from 'path';
import expressServer from './http';
import MySql from './mysql';
import logger from './src/libs/logger';
import { initStoreFolder } from './src/libs/helper';

const DB = new MySql();
const pathFolderStore = process.env.PATH_FOLDER_STORE || path.resolve(__dirname, '../storage');
const pathFolderLogs = process.env.PATH_FOLDER_LOGS || path.resolve(__dirname, '../logs');
// Wait for connect to Mysql success before start express server
Promise.all([
  initStoreFolder(pathFolderLogs),
  initStoreFolder(pathFolderStore),
]).then(() => {
  logger.info('Connecting to MySql ...');

  return DB.openConnect();
}).then(() => {
  logger.info('MySql is connected');

  return expressServer();
}).catch(err => {
  logger.error(`[START]: ${err}`);
  process.exit(1);
});
