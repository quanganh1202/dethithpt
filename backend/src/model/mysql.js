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

  async filter(filter, options = {}) {
    const {
      cols,
      number,
      offset,
      sortBy,
    } = options;
    const conn = await this.openConnect();
    let query = 'SELECT ?? FROM ??';
    if (filter) {
      query = `SELECT ?? FROM ?? WHERE ${filter}`;
    }

    if (number && offset) {
      query += ` LIMIT ${number},${offset}`;
    }

    if (sortBy) {
      const split = sortBy.split('.');
      query += ` ORDER BY ${split[0]} ${split[1].toUpperCase()}`;
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
      'UPDATE ?? SET ?',
      [this.table, body],
    ).then(result => {
      conn.end();

      return result;
    });
  }

  async deleteById(id) {
    const conn = await this.openConnect();

    return conn.query(
      'DELETE FROM ?? WHERE id = ?',
      [this.table, id],
    ).then(result => {
      conn.end();

      return result;
    });
  }
}

export default Database;