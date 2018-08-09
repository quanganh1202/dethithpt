import MySQL from './mysql';
import queryBuilder from '../libs/queryBuilder';

class Document {
  constructor() {
    this.DB = new MySQL('tbDocument');
  }

  async getList(filter, options) {
    const criteria = queryBuilder(
      filter,
      options.searchType ? options.searchType.toUpperCase(): undefined
    );
    const docs = await this.DB.filter(criteria, options);

    return docs || [];
  }

  async addNewDocument(doc) {
    const result = await this.DB.insert(doc);

    return result;
  }
}

export default Document;
