import { isUndefined } from 'util';
import moment from 'moment';
import ES from '../../elastic';
import logger from '../libs/logger';
import { filterParamsHandler, sortParamsHandler } from '../libs/esHelper';
const type = process.env.ES_TYPE_NEWS || 'news';
const index = process.env.ES_INDEX_NEWS || 'news';
const elasticsearch = new ES(index, type);

const handleSubjectError = (error) => {
  logger.error(`[NEWS] - ${error.message || error}`);

  return {
    statusCode: error.status || error.code || 500,
    error: 'Unexpected Server Internal Error',
  };
};

export default {
  getOne: async (subjectId) => {
    try {
      if (!subjectId) {
        return {
          statusCode: 400,
          error: 'News ID can not be null or undefined',
        };
      }
      const result = await elasticsearch.get(subjectId);

      return result;
    } catch(error) {
      return handleSubjectError(error);
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
      const isScroll = !isUndefined(scroll);
      const existSizeAndOffsetInvalid = ((size && !numberRegex.test(size)) || ( offset && !numberRegex.test(offset)));
      const existSizeAndOffsetIsAnEmptyString = (size === '' || offset === '');
      if ( existSizeAndOffsetInvalid || existSizeAndOffsetIsAnEmptyString) {
        return {
          statusCode: 400,
          error: 'Size & offset is only allowed to contain digits',
        };
      }
      const sortObj = sortParamsHandler(sort);
      if (sortObj.statusCode !== 200) return sortObj; // Return error
      const filterBuilt = filterParamsHandler({ name });
      if (filterBuilt.statusCode !== 200) return filterBuilt; // Return error
      const fieldsToArray = fields ? fields.split(',') : undefined; // List fields specific by ","
      const from = size && offset && !isScroll ? offset : 0; // Fulfil size and offset to get from value. Default equal 0
      const result = isScroll ?
        await elasticsearch.getInitialScroll( filterBuilt.data, fieldsToArray, sortObj.data, size):
        await elasticsearch.getList(filterBuilt.data, fieldsToArray,  sortObj.data, from, size );

      return result;
    } catch (err) {
      return handleSubjectError(err);
    }
  },

  getNextPage: async (scrollId) => {
    try {
      const result = await elasticsearch.getNextScroll(scrollId);

      return result;
    } catch (err) {
      return handleSubjectError(err);
    }
  },

  create: async (newsId, body) => {
    try {
      body.view = 0;
      const now = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
      body.createdAt = now;
      const result = await elasticsearch.insert(body, newsId);

      return result;
    } catch (error) {
      return handleSubjectError(error);
    }
  },

  update: async (newsId, body) => {
    try {
      if (!newsId) {
        return {
          statusCode: 400,
          error: 'Missing news id',
        };
      }
      const now = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
      body.updatedAt = now;
      const result = await elasticsearch.update(body, newsId);

      return result;
    } catch (error) {
      return handleSubjectError(error);
    }
  },

  delete: async (newsId) => {
    try {
      if (!newsId) {
        return {
          statusCode: 400,
          error: 'Missing news id',
        };
      }
      const result = await elasticsearch.remove(newsId);

      return result;
    } catch (error) {
      return handleSubjectError(error);
    }
  },
};