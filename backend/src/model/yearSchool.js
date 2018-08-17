import MySQL from './mysql';
import queryBuilder from '../libs/queryBuilder';

class YearSchool {
  constructor() {
    this.DB = new MySQL('tbYearSchool');
  }

  async getListYearSchool(filter, options = {}) {
    const criteria = queryBuilder(
      filter,
      options.searchType ? options.searchType.toUpperCase(): undefined //EXACTLY OR FULLTEXT
    );
    const docs = await this.DB.filter(criteria, options);

    return docs || [];
  }

  async addNewYearSchool(doc) {
    const result = await this.DB.insert(doc);

    return result;
  }

  async getYearSchoolById(id, cols) {
    const result = await this.DB.get(id, cols);

    return result;
  }

  async updateYearSchoolById(id, body) {
    const result = await this.DB.update(id, body);

    return result;
  }

  async deleteYearSchoolById(id) {
    const result = await this.DB.deleteById(id);

    return result;
  }
}

export default YearSchool;
