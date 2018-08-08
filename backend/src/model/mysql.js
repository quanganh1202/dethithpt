import mysql from 'mysql';

class Database {
  constructor(table) {
    this.type = table;
    this.connection = this.initConnect().then(r => r).catch(e => e);
  }

  initConnect() {
    return new Promise((resolve, reject) => {
      const connection = mysql.createConnection({
        host: process.env.MYSQL_HOST || 'localhost',
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '12345678',
        database: process.env.MYSQL_DATABASE || 'dethithpt',
      });
      connection.connect((err) => {
        if (err) {
          return reject('Unexpected error when are connecting to MySQL');
        }
        this.connection = connection;
        resolve(connection);
      });
    });
  }

  closeConnect() {
    this.connection.end();
  }

  getItem(id) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `SELECT * FROM ${this.type} WHERE id = ?`,
        [id],
        (err, res) => {
          err ? reject(err) : resolve(res);
        }
      );
    });
  }

  getItems(filter, cols) {
    let query = 'SELECT ?? FROM ??';
    if (filter) {
      query = `SELECT ?? FROM ?? WHERE ${filter}`;
    }

    return new Promise((resolve, reject) => {
      this.connection.query(
        query,
        [cols || '*', this.type],
        (err, res) => {
          err ? reject(err) : resolve(res);
        }
      );
    });
  }

  insertItem(body) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `INSERT INTO ${this.type} SET ?`,
        body,
        (err, res) => {
          err ? reject(err) : resolve(res);
        }
      );
    });
  }

  // updateItem(body, id) {

  // }

  // deleteItem(id) {

  // }
}

export default Database;