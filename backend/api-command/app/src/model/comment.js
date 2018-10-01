import MySQL from '../../mysql';
import queryBuilder from '../libs/queryBuilder';

class Comment {
  constructor() {
    this.DB = new MySQL('tbComment');
  }

  async getListComment(filter, options = {}) {
    const criteria = queryBuilder(
      filter,
      options.searchType ? options.searchType.toUpperCase(): undefined //EXACTLY OR FULLTEXT
    );
    const docs = await this.DB.filter(criteria, options);

    return docs || [];
  }

  async addNewComment(doc) {
    const result = await this.DB.insert(doc);

    return result;
  }

  async getCommentById(id, cols) {
    const result = await this.DB.get(id, cols);

    return result;
  }

  async updateCommentById(id, body) {
    const result = await this.DB.update(id, body);

    return result;
  }

  async deleteCommentById(id) {
    const result = await this.DB.deleteById(id);

    return result;
  }
}

export default Comment;
