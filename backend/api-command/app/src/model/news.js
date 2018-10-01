import MySQL from '../../mysql';
import queryBuilder from '../libs/queryBuilder';

class News {
  constructor() {
    this.DB = new MySQL('tbNews');
  }

  async getList(filter, options) {
    const criteria = queryBuilder(filter);
    const news = await this.DB.filter(criteria, options);

    return news || [];
  }

  async getById(id, cols) {
    const result = await this.DB.get(id, cols);

    return result;
  }

  async addNewNews(news) {
    const result = await this.DB.insert(news);

    return result;
  }

  async updateNews(id, news) {
    const result = await this.DB.update(id, news);

    return result;
  }

  async deleteNews(id) {
    const result = await this.DB.deleteById(id);

    return result;
  }
}

export default News;
