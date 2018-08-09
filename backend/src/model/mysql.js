import mysql from 'promise-mysql';

class Database {
  constructor(table) {
    this.table = table;
  }

  async openConnect() {
    try {
      const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST || 'localhost',
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '12345678',
        database: process.env.MYSQL_DATABASE || 'dethithpt',
      });

      return connection;
    } catch (ex) {
      return (ex.message || 'Unexpected error when are connecting to MySQL');
    }
  }

  async closeConnect() {
    await this.connection.end();
  }

  async get(id, cols) {
    const conn = await this.openConnect();

    return conn.query(
      'SELECT ?? FROM ?? WHERE id = ?',
      [cols, this.table, id],
    ).then(result => {
      conn.end();

      return result;
    });
  }

  async filter(filter, cols) {
    const conn = await this.openConnect();
    let query = 'SELECT ?? FROM ??';
    if (filter) {
      query = `SELECT ?? FROM ?? WHERE ${filter}`;
    }

    return conn.query(
      query,
      [cols || '*', this.table],
    ).then(result => {
      conn.end();

      return result;
    });
  }

  async insert(body) {
    const conn = await this.openConnect();

    return conn.query(
      'INSERT INTO ?? SET ?',
      [this.table, body],
    ).then(result => {
      conn.end();

      return result;
    });
  }

  async update(id, body) {
    const conn = await this.openConnect();

    return conn.query(
      'INSERT INTO ?? SET ?',
      [this.table, body],
    ).then(result => {
      conn.end();

      return result;
    });
  }


  // deleteItem(id) {

  // }
}

export default Database;