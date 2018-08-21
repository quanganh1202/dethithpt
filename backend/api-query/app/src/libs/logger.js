import winston from 'winston';
import path from 'path';
import moment from 'moment';

const log = winston.createLogger({
  transports: [
    // info console log
    new (winston.transports.Console)({
      level: 'info',
      name: 'info-console',
      colorize: true,
      timestamp: () => moment().format('YYYY-MM-DD HH-mm-ss'),
      formatter: winston.format.simple(),
      json: false,
    }),
    // info log file
    new (winston.transports.File)({
      level: 'info',
      name: 'info-file',
      filename: path.resolve(__dirname, '../../../', 'logs',
        `${moment().format('YYYYMMDD')}-development-info.log`),
      timestamp: () => moment().format('YYYY-MM-DD HH-mm-ss'),
      formatter: options => `[${options.timestamp()}]: ${options.message ||''}`,
      json: false,
    }),
    // errors console log
    new (winston.transports.Console)({
      level: 'error',
      name: 'error-console',
      colorize: true,
      timestamp: () => moment().format('YYYY-MM-DD HH-mm-ss'),
      formatter: options => `[${options.timestamp()}]: ${options.message || ''}`,
    }),
    // errors log file
    new (winston.transports.File)({
      level: 'error',
      name: 'error-file',
      filename: path.resolve(__dirname, '../../../', 'logs',
        `${moment().format('YYYYMMDD')}-development-error.log`),
      timestamp: () => moment().format('YYYY-MM-DD HH-mm-ss'),
      formatter: options => `[${options.timestamp()}]: ${options.message || ''}`,
      json: false,
    }),
  ],
});

export default log;