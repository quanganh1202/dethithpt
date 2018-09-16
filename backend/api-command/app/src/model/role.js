import MySQL from '../../mysql';
import queryBuilder from '../libs/queryBuilder';

class Role {
  constructor() {
    this.DB = new MySQL('tbRole');
  }

  async getListRole(filter, options = {}) {
    const criteria = queryBuilder(
      filter,
      options.searchType ? options.searchType.toUpperCase(): undefined //EXACTLY OR FULLTEXT
    );
    const docs = await this.DB.filter(criteria, options);

    return docs || [];
  }

  async addNewRole(doc) {
    const result = await this.DB.insert(doc);

    return result;
  }

  async getRoleById(id, cols) {
    const result = await this.DB.get(id, cols);

    return result;
  }

  async updateRoleById(id, body) {
    const result = await this.DB.update(id, body);

    return result;
  }

  async deleteRoleById(id) {
    const result = await this.DB.deleteById(id);

    return result;
  }
}

export default Role;
