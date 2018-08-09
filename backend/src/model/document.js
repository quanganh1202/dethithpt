import MySQL from './mysql';
import queryBuilder from '../libs/queryBuilder';

class Document {
  constructor() {
    this.DB = new MySQL('tbDocument');
  }

  async getList(filter, cols) {
    const criteria = queryBuilder(filter);
    const docs = await this.DB.filter(criteria, cols);

    return docs || [];
  }

  async addNewDocument(doc) {
    const result = await this.DB.insert(doc);

    return result;
  }
}

export default Document;
