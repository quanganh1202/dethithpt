import 'babel-polyfill';
import expressServer from './http';
import elasticsearch from './elastic';
import logger from './src/libs/logger';
import { initStoreFolder } from './src/libs/helper';

const pathFolderLogs = process.env.PATH_FOLDER_LOGS || `${__dirname}/logs`;

initStoreFolder(pathFolderLogs)
  .then(elasticsearch.ping()) // Ping ES server to check connection
  .then(expressServer()) // Start http server
  .then(() => {
    logger.info('Server is deployed');
    elasticsearch.close(); // Close connection
  })
  .catch(err => logger.error(`[ERR]: ${err}`));
