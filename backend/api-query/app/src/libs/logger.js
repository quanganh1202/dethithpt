import winston, { format } from 'winston';
import path from 'path';
import moment from 'moment';
const { combine, timestamp, printf } = format;

const myFormat = printf(info => {
  return `[API-QUERY][${info.timestamp}][${info.level.toUpperCase()}]${info.message}`;
});

const log = winston.createLogger({
  format: combine(
    timestamp(),
    myFormat
  ),
  transports: [
    // info console log
    new (winston.transports.Console)({
      level: 'info',
      name: 'info-console',
      colorize: true,
    }),
    // info log file
    new (winston.transports.File)({
      level: 'info',
      name: 'info-file',
      filename: path.resolve(__dirname, '../../../', 'logs',
        `${moment().format('YYYYMMDD')}-development-info.log`),
    }),
    // errors console log
    new (winston.transports.Console)({
      level: 'error',
      name: 'error-console',
      colorize: true,
    }),
    // errors log file
    new (winston.transports.File)({
      level: 'error',
      name: 'error-file',
      filename: path.resolve(__dirname, '../../../', 'logs',
        `${moment().format('YYYYMMDD')}-development-error.log`),
    }),
  ],
});

export default log;