import 'babel-polyfill';
import expressServer from './http';
import elasticsearch from './elastic';
import logger from './src/libs/logger';
import { initStoreFolder } from '../app/src/libs/helpers';

const pathFolderLogs = process.env.PATH_FOLDER_LOGS || `${__dirname}/logs`;
const el = new elasticsearch();

const initial = async () => {
  try {
    await initStoreFolder(pathFolderLogs);
    logger.info('Logs folder is created');
    const stt = await el.ping();
    if (stt.error) {
      throw stt;
    }
    logger.info('ElasticSearch connect successfully');
    await expressServer();
    logger.info('Starting is DONE');
  } catch (err) {
    logger.error(`[START][ERROR]: ${err}`);
  }
};

initial();