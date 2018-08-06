import MySQL from './mysql';

class User {
  constructor() {
    this.DB = new MySQL('tbUser');
  }

  async getList(filter, cols) {
    const users = await this.DB.getItems(filter, cols);

    return users || [];
  }
}

export default User;
