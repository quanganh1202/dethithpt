import ES from '../../elastic';
import logger from '../libs/logger';

const handleDocumentError = (error) => {
  logger.error(`[COMMON] - ${error.message || error}`);

  return {
    statusCode: error.status || error.code || 500,
    error: 'Unexpected Server Internal Error',
  };
};
const index = process.env.ES_INDEX || 'dethithpt';
export default {
  getTotals: async (types) => {
    try {
      const arrTypes =types.split(',');
      const promises = arrTypes.map(t => {
        const elasticsearch = new ES(index, t);

        return elasticsearch.getCount();
      });

      const result = await Promise.all(promises);

      return {
        statusCode: 200,
        data: arrTypes.reduce((pre, cur, i) => {
          pre[cur] = result[i].count;

          return pre;
        }, {}),
      };
    }
    catch(err) {
      return handleDocumentError(err);
    }
  },
};