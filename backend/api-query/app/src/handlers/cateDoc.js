import ES from '../../elastic';
import logger from '../libs/logger';

const handleCategoryError = (error) => {
  logger.error(`[CATEGORY_DOCUMENT] - ${error.message || error}`);

  return {
    statusCode: error.status || error.code || 500,
    error: 'Unexpected Server Internal Error',
  };
};
const index = process.env.ES_INDEX_CATE_DOC_REF || 'catedocrefs';
const type = process.env.ES_TYPE_CATE_DOC_REF || 'cateDocRef';
const elasticSearch = new ES(index, type);
export default {
  getAggs: async () => {
    try {
      const result = await elasticSearch.getAggs('cateName');

      return result;
    } catch (err) {
      return handleCategoryError(err);
    }
  },
};