import mysql from 'mysql';

class Database {
  constructor() {
    this.connection = this.initConnect();
  }

  initConnect() {
    const connection = mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'administrator',
      password: process.env.MYSQL_PASSWORD || '123456',
      database: process.env.MYSQL_DATABASE || 'dethithpt',
    });
    connection.connect();

    return connection;
  }

  closeConnect() {
    this.connection.end();
  }

  getItem(id) {

  }

  getItems(filter, sort, offset, size) {

  }

  insertItem(body, id) {

  }

  updateItem(body, id) {

  }

  deleteItem(id) {

  }
}

export default Database;