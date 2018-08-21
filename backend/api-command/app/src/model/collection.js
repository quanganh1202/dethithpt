import MySQL from '../../mysql';
import queryBuilder from '../libs/queryBuilder';

class Collection {
  constructor() {
    this.DB = new MySQL('tbCollection');
  }

  async getListCollection(filter, options = {}) {
    const criteria = queryBuilder(
      filter,
      options.searchType ? options.searchType.toUpperCase(): undefined //EXACTLY OR FULLTEXT
    );
    const docs = await this.DB.filter(criteria, options);

    return docs || [];
  }

  async addNewCollection(doc) {
    const result = await this.DB.insert(doc);

    return result;
  }

  async getCollectionById(id, cols) {
    const result = await this.DB.get(id, cols);

    return result;
  }

  async updateCollectionById(id, body) {
    const result = await this.DB.update(id, body);

    return result;
  }

  async deleteCollectionById(id) {
    const result = await this.DB.deleteById(id);

    return result;
  }
}

export default Collection;
