import { isUndefined } from 'util';
import moment from 'moment';
import ES from '../../elastic';
import { updateMoneyUserById } from '../libs/esHelper';
import logger from '../libs/logger';
import { filterParamsHandler, sortParamsHandler } from '../libs/esHelper';

const handlePurchaseError = (error) => {
  logger.error(`[PURCHASE] - ${error.message || error}`);

  return {
    statusCode: error.status || error.code || 500,
    error: 'Unexpected Server Internal Error',
  };
};

const elasticsearch = new ES('purchases', 'history');

export default {
  getList: async (options) => {
    const {
      userId,
      userName,
      docName,
      docId,
      action,
      sort,
      scroll,
    } = options;
    try {
      const isScroll = !isUndefined(scroll);
      const sortObj = sortParamsHandler(sort);
      if (sortObj.statusCode !== 200) return sortObj; // Return error
      const filterBuilt = filterParamsHandler({ userId, action, userName, docName, docId });
      if (filterBuilt.statusCode !== 200) return filterBuilt; // Return error
      const result = isScroll ?
        await elasticsearch.getInitialScroll(filterBuilt.data, undefined, sortObj.data):
        await elasticsearch.getList( filterBuilt.data, undefined, sortObj.data );

      return result;
    } catch (err) {
      return handlePurchaseError(err);
    }
  },

  create: async (id, options) => {
    try {
      const now = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
      options.createdAt = now;
      await elasticsearch.insert(options, id);
      await updateMoneyUserById(options.userId, options.money, options.action);

      return {
        statusCode: 200,
        message: 'Success',
      };
    } catch (err) {
      return handlePurchaseError(err);
    }
  },
};