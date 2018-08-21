import MySQL from '../../mysql';
import queryBuilder from '../libs/queryBuilder';

class Category {
  constructor() {
    this.DB = new MySQL('tbCategory');
  }

  async getListCategory(filter, options = {}) {
    const criteria = queryBuilder(
      filter,
      options.searchType ? options.searchType.toUpperCase(): undefined //EXACTLY OR FULLTEXT
    );
    const docs = await this.DB.filter(criteria, options);

    return docs || [];
  }

  async addNewCategory(doc) {
    const result = await this.DB.insert(doc);

    return result;
  }

  async getCategoryById(id, cols) {
    const result = await this.DB.get(id, cols);

    return result;
  }

  async updateCategoryById(id, body) {
    const result = await this.DB.update(id, body);

    return result;
  }

  async deleteCategoryById(id) {
    const result = await this.DB.deleteById(id);

    return result;
  }
}

export default Category;
