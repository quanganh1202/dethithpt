import 'babel-polyfill';
import expressServer from './server/index';
import MySql from './src/model/mysql';

const DB = new MySql();
// Wait for connect to Mysql success before start express server
console.log('Connecting to MySql ...');
DB.initConnect().then(() => {
  console.log('MySql connected');
  expressServer();
}).catch(err => console.log(`[ERR]: ${err}`));
