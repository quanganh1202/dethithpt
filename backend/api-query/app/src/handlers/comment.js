import { isUndefined } from 'util';
import ES from '../../elastic';
import logger from '../libs/logger';
import { filterParamsHandler, sortParamsHandler } from '../libs/esHelper';
const type = process.env.ES_TYPE_COMMENT || 'comment';
const index = process.env.ES_INDEX_COMMENT || 'comments';
const elasticsearch = new ES(index, type);

const handleCommentError = (error) => {
  logger.error(`[COMMENT] - ${error.message || error}`);

  return {
    statusCode: error.status || error.code || 500,
    error: 'Unexpected Server Internal Error',
  };
};

export default {
  getOne: async (id) => {
    try {
      const result = await elasticsearch.get(id);

      return result;
    } catch(error) {
      return handleCommentError(error);
    }
  },

  getList: async (options) => {
    try {
      const {
        size,
        offset,
        sort,
        fields,
        userName,
        docName,
        docId,
        userId,
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
      const filterBuilt = filterParamsHandler({ userName, docName, docId, userId });
      if (filterBuilt.statusCode !== 200) return filterBuilt; // Return error
      const fieldsToArray = fields ? fields.split(',') : undefined; // List fields specific by ","
      const from = size && offset && !isScroll ? offset : 0; // Fulfil size and offset to get from value. Default equal 0
      const result = isScroll ?
        await elasticsearch.getInitialScroll( filterBuilt.data, fieldsToArray, sortObj.data, size):
        await elasticsearch.getList(filterBuilt.data, fieldsToArray,  sortObj.data, from, size );

      return result;
    } catch (err) {
      return handleCommentError(err);
    }
  },

  getNextPage: async (scrollId) => {
    try {
      const result = await elasticsearch.getNextScroll(scrollId);

      return result;
    } catch (err) {
      return handleCommentError(err);
    }
  },

  create: async (id, body) => {
    try {
      const result = await elasticsearch.insert(body, id);

      return result;
    } catch (error) {
      return handleCommentError(error);
    }
  },

  update: async (id, body) => {
    try {
      const result = await elasticsearch.update(body, id);

      return result;
    } catch (error) {
      return handleCommentError(error);
    }
  },

  delete: async (id) => {
    try {
      const result = await elasticsearch.remove(id);

      return result;
    } catch (error) {
      return handleCommentError(error);
    }
  },
};