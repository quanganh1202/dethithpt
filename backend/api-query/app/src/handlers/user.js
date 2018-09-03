import { isUndefined } from 'util';
import moment from 'moment';
import ES from '../../elastic';
import logger from '../libs/logger';
import { filterParamsHandler, sortParamsHandler } from '../libs/esHelper';
const type = process.env.ES_TYPE_CATEGORY || 'user';
const index = process.env.ES_INDEX_CATEGORY || 'users';
const elasticsearch = new ES(index, type);

const handleCategoryError = (error) => {
  logger.error(`[USER] - ${error.message || error}`);

  return {
    statusCode: error.status || error.code || 500,
    error: 'Unexpected Server Internal Error',
  };
};

export default {
  getOne: async (userId) => {
    try {
      if (!userId) {
        return {
          statusCode: 400,
          error: 'User ID can not be null or undefined',
        };
      }
      const result = await elasticsearch.get(userId);

      return result;
    } catch(error) {
      return handleCategoryError(error);
    }
  },

  getList: async (options) => {
    try {
      const {
        size,
        offset,
        sort,
        fields,
        name,
        scroll,
      } = options;
      const numberRegex = new RegExp(/^[0-9]*$/);
      const withoutZeroRegex = new RegExp(/^(0)$/);
      const isScroll = !isUndefined(scroll);
      const existSizeAndOffsetInvalid = ((size && !numberRegex.test(size)) || ( offset && !numberRegex.test(offset)));
      const existSizeAndOffsetIsAnEmptyString = (size === '' || offset === '');
      if ( existSizeAndOffsetInvalid || existSizeAndOffsetIsAnEmptyString) {
        return {
          statusCode: 400,
          error: 'Size & offset is only allowed to contain digits',
        };
      }
      const offsetOrSizeIsZero = ((size && withoutZeroRegex.test(size)) || (offset && withoutZeroRegex.test(offset)));
      if (offsetOrSizeIsZero) { // Only check offset if request is scroll. If not ignore
        return {
          statusCode: 400,
          error: 'Size & offset cannot be number 0',
        };
      }
      const sortObj = sortParamsHandler(sort);
      if (sortObj.statusCode !== 200) return sortObj; // Return error
      const filterBuilt = filterParamsHandler({ name });
      if (filterBuilt.statusCode !== 200) return filterBuilt; // Return error
      const fieldsToArray = fields ? fields.split(',') : undefined; // List fields specific by ","
      const from = size && offset && !isScroll ? size * (offset - 1) : 0; // Fulfil size and offset to get from value. Default equal 0
      const result = isScroll ?
        await elasticsearch.getInitialScroll( filterBuilt.data, fieldsToArray, sortObj.data, size):
        await elasticsearch.getList(filterBuilt.data, fieldsToArray,  sortObj.data, from, size );

      return result;
    } catch (err) {
      return handleCategoryError(err);
    }
  },

  getNextPage: async (scrollId) => {
    try {
      const result = await elasticsearch.getNextScroll(scrollId);

      return result;
    } catch (err) {
      return handleCategoryError(err);
    }
  },

  create: async (userId, body) => {
    try {
      const now = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
      body.createdAt = now;
      const result = await elasticsearch.insert(body, userId);

      return result;
    } catch (error) {
      return handleCategoryError(error);
    }
  },

  update: async (userId, body) => {
    try {
      if (!userId) {
        return {
          statusCode: 400,
          error: 'Missing user id',
        };
      }
      const result = await elasticsearch.update(userId, body);

      return result;
    } catch (error) {
      return handleCategoryError(error);
    }
  },

  delete: async (userId) => {
    try {
      if (!userId) {
        return {
          statusCode: 400,
          error: 'Missing user id',
        };
      }
      const result = await elasticsearch.remove(userId);

      return result;
    } catch (error) {
      return handleCategoryError(error);
    }
  },
};