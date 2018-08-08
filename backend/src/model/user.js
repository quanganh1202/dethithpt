import MySQL from './mysql';

class User {
  constructor() {
    this.DB = new MySQL('tbUser');
  }

  generateCriteria(criteriaObj = {}) {
    return Object.entries(criteriaObj).reduce((pre, cur) => {
      if (pre) return `${pre} AND ${cur[0]} = '${cur[1]}'`;

      return `${cur[0]} = '${cur[1]}'`;
    }, undefined);
  }

  async getList(filter, cols) {
    const criteria = this.generateCriteria(filter);
    const users = await this.DB.getItems(criteria, cols);

    return users || [];
  }

  async addNewUser(user) {
    const result = await this.DB.insertItem(user);

    return result;
  }
}

export default User;
