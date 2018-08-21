import MySQL from '../../mysql';
import queryBuilder from '../libs/queryBuilder';

class Subject {
  constructor() {
    this.DB = new MySQL('tbSubject');
  }

  async getListSubject(filter, options = {}) {
    const criteria = queryBuilder(
      filter,
      options.searchType ? options.searchType.toUpperCase(): undefined //EXACTLY OR FULLTEXT
    );
    const docs = await this.DB.filter(criteria, options);

    return docs || [];
  }

  async addNewSubject(doc) {
    const result = await this.DB.insert(doc);

    return result;
  }

  async getSubjectById(id, cols) {
    const result = await this.DB.get(id, cols);

    return result;
  }

  async updateSubjectById(id, body) {
    const result = await this.DB.update(id, body);

    return result;
  }

  async deleteSubjectById(id) {
    const result = await this.DB.deleteById(id);

    return result;
  }
}

export default Subject;
