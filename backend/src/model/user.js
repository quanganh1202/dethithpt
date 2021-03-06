import MySQL from './mysql';
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

  async addNewUser(user) {
    const result = await this.DB.insert(user);

    return result;
  }
}

export default User;
