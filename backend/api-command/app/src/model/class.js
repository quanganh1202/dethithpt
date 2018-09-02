import MySQL from '../../mysql';
import queryBuilder from '../libs/queryBuilder';

class Class {
  constructor() {
    this.DB = new MySQL('tbClass');
  }

  async getListClass(filter, options = {}) {
    const criteria = queryBuilder(
      filter,
      options.searchType ? options.searchType.toUpperCase(): undefined //EXACTLY OR FULLTEXT
    );
    const docs = await this.DB.filter(criteria, options);

    return docs || [];
  }

  async addNewClass(doc) {
    const result = await this.DB.insert(doc);

    return result;
  }

  async getClassById(id, cols) {
    const result = await this.DB.get(id, cols);

    return result;
  }

  async updateClassById(id, body) {
    const result = await this.DB.update(id, body);

    return result;
  }

  async deleteClassById(id) {
    const result = await this.DB.deleteById(id);

    return result;
  }
}

export default Class;
