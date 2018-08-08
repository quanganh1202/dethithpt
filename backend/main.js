import 'babel-polyfill';
import expressServer from './server/index';
import MySql from './src/model/mysql';
import logger from './src/libs/logger';

const DB = new MySql();
// Wait for connect to Mysql success before start express server
logger.info('Connecting to MySql ...');
DB.initConnect().then(() => {
  logger.info('MySql is connected');
  expressServer();
}).catch(err => logger.error(`[ERR]: ${err}`));
