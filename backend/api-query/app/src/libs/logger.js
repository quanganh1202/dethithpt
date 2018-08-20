/* istanbul ignore next */

import winston from 'winston';
import path from 'path';
import moment from 'moment';

const logger = new (winston.Logger)({
  transports: [
    // Log info to console
    new (winston.transports.Console)({
      level: 'info',
      name: 'info-console',
      timestamp: () => moment(),
      formatter: options => `[${options.timestamp().format('YYYY-MM-DD HH-mm-ss')}] : ${options.message || ''}`,
    }),
    // Log info to file
    new (winston.transports.File)({
      level: 'info',
      name: 'info-file',
      filename: path.resolve(__dirname, '..', 'log', `info-${moment().format('YYYYMMDD')}.log`),
      timestamp: () => moment(),
      formatter: options => `[${options.timestamp().format('YYYY-MM-DD HH-mm-ss')}] : ${options.message || ''}`,
      json: false,
    }),
    // Log error to console
    new (winston.transports.Console)({
      level: 'error',
      name: 'error-console',
      timestamp: () => moment(),
      formatter: options => `[${options.timestamp().format('YYYY-MM-DD HH-mm-ss')}] : ${options.message || ''}`,
    }),
    // Log error to file
    new (winston.transports.File)({
      level: 'error',
      name: 'error-file',
      filename: path.resolve(__dirname, '..', 'log', `errors-${moment().format('YYYYMMDD')}.log`),
      timestamp: () => moment(),
      formatter: options => `[${options.timestamp().format('YYYY-MM-DD HH-mm-ss')}] : ${options.message || ''}`,
      json: false,
    }),
  ],
});

export default logger;
