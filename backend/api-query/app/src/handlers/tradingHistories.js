import { isUndefined } from 'util';
import ES from '../../elastic';
import logger from '../libs/logger';
import { filterParamsHandler, sortParamsHandler } from '../libs/esHelper';

const handleDocumentError = (error) => {
  logger.error(`[HISTORY] - ${error.message || error}`);

  return {
    statusCode: error.status || error.code || 500,
    error: 'Unexpected Server Internal Error',
  };
};

const elasticsearch = new ES('histories', 'history');

export default {
  getList: async (userId, options) => {
    const {
      sort,
      scroll,
    } = options;
    try {
      const isScroll = !isUndefined(scroll);
      const sortObj = sortParamsHandler(sort);
      if (sortObj.statusCode !== 200) return sortObj; // Return error
      const filterBuilt = filterParamsHandler({ userId });
      if (filterBuilt.statusCode !== 200) return filterBuilt; // Return error
      const result = isScroll ?
        await elasticsearch.getInitialScroll(filterBuilt.data, undefined, sortObj.data):
        await elasticsearch.getList( filterBuilt.data, undefined, sortObj.data );

      return result;
    } catch (err) {
      return handleDocumentError(err);
    }
  },

  getIncome: async (userId) => {
    try {
      const filterBuilt = filterParamsHandler({ userId });
      if (filterBuilt.statusCode !== 200) return filterBuilt; // Return error
      const result = await elasticsearch.getList(filterBuilt.data, ['money', 'tradingType']);

      const income = result.data.reduce((pre, cur) => {
        if (cur.tradingType === 'sub') {
          pre -= parseInt(cur.money);
        } else {
          pre += parseInt(cur.money);
        }

        return pre;
      }, 0);

      return { data: income, statusCode: 200 };
    } catch (err) {
      return handleDocumentError(err);
    }
  },
};