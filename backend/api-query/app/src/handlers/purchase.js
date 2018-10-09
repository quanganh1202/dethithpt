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
      actorName,
      actorId,
      actorRole,
      docId,
      action,
      sort,
      size,
      offset,
      scroll,
    } = options;
    try {
      const numberRegex = new RegExp(/^[0-9]*$/);
      const existSizeAndOffsetInvalid = ((size && !numberRegex.test(size)) || ( offset && !numberRegex.test(offset)));
      const existSizeAndOffsetIsAnEmptyString = (size === '' || offset === '');
      if ( existSizeAndOffsetInvalid || existSizeAndOffsetIsAnEmptyString) {
        return {
          statusCode: 400,
          error: 'Size & offset is only allowed to contain digits',
        };
      }
      const isScroll = !isUndefined(scroll);
      const sortObj = sortParamsHandler(sort);
      if (sortObj.statusCode !== 200) return sortObj; // Return error
      const filterBuilt = filterParamsHandler({
        userId,
        action,
        userName,
        docName,
        docId,
        actorName,
        actorId,
        actorRole,
      });
      if (filterBuilt.statusCode !== 200) return filterBuilt; // Return error
      const from = size && offset && !isScroll ? offset : 0;
      const result = isScroll ?
        await elasticsearch.getInitialScroll(filterBuilt.data, undefined, sortObj.data, size):
        await elasticsearch.getList( filterBuilt.data, undefined, sortObj.data, from, size );

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