import MySQL from '../../mysql';
import queryBuilder from '../libs/queryBuilder';

class User {
  constructor() {
    this.DB = new MySQL('tbUser');
  }

  async getList(filter, options) {
    const criteria = queryBuilder(filter);
    const users = await this.DB.filter(criteria, options);

    return users || [];
  }

  async getById(id, cols) {
    const result = await this.DB.get(id, cols);

    return result;
  }

  async addNewUser(user) {
    const result = await this.DB.insert(user);

    return result;
  }

  async updateUser(id, user) {
    const result = await this.DB.update(id, user);

    return result;
  }

  async deleteUser(id) {
    const result = await this.DB.deleteById(id);

    return result;
  }
}

export default User;
