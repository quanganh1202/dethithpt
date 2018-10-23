import { isUndefined } from 'util';
import moment from 'moment';
import ES from '../../elastic';
import logger from '../libs/logger';
import { filterParamsHandler, sortParamsHandler, updateDocsRefToCate, removeDocsRefToCate } from '../libs/esHelper';
const type = process.env.ES_TYPE_CATEGORY || 'category';
const index = process.env.ES_INDEX_CATEGORY || 'categories';
const elasticsearch = new ES(index, type);

const handleCategoryError = (error) => {
  logger.error(`[CATEGORY] - ${error.message || error}`);

  return {
    statusCode: error.status || error.code || 500,
    error: 'Unexpected Server Internal Error',
  };
};

export default {
  getOne: async (cateId) => {
    try {
      if (!cateId) {
        return {
          statusCode: 400,
          error: 'Category ID can not be null or undefined',
        };
      }
      const result = await elasticsearch.get(cateId);

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
        userName,
        priority,
        scroll,
        filterType,
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
      const filterBuilt = filterParamsHandler({ name, priority, userName }, filterType);
      if (filterBuilt.statusCode !== 200) return filterBuilt; // Return error
      const fieldsToArray = fields ? fields.split(',') : undefined; // List fields specific by ","
      const from = size && offset && !isScroll ? offset : 0; // Fulfil size and offset to get from value. Default equal 0
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

  create: async (cateId, body) => {
    try {
      body.view = 0;
      const now = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
      body.createdAt = now;
      body.numDocRefs = 0;
      body.position = !body.position ? 0 : body.position;
      body.priority = !body.priority ? 0 : body.priority;
      const result = await elasticsearch.insert(body, cateId);

      return result;
    } catch (error) {
      return handleCategoryError(error);
    }
  },

  update: async (cateId, body) => {
    try {
      if (!cateId) {
        return {
          statusCode: 400,
          error: 'Missing category id',
        };
      }
      const now = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
      body.updatedAt = now;
      if (body.name) {
        // Update all docs ref to this collection
        const filterBuilt = filterParamsHandler({
          'cates.cateId': cateId,
        });
        const docES = new ES('documents', 'document');
        const lsDoc = await docES.getList(filterBuilt.data);
        // Process if have doc ref to this collection
        if (lsDoc.total) {
          const promise = [].concat(...updateDocsRefToCate(lsDoc.data, cateId, body.name));
          Promise.all(promise)
            .catch(e => logger.error(`[QUERY][CATE]: Update category at document fail ${e}`));
        }
      }
      const result = await elasticsearch.update(body, cateId);

      return result;
    } catch (error) {
      return handleCategoryError(error);
    }
  },

  delete: async (cateId) => {
    try {
      if (!cateId) {
        return {
          statusCode: 400,
          error: 'Missing category id',
        };
      }

      const result = await elasticsearch.remove(cateId);
      const docES = new ES('documents', 'document');
      const filterBuilt = filterParamsHandler({
        'cates.cateId': cateId,
      });
      const lsDoc = await docES.getList(filterBuilt.data);
      if (lsDoc.total) {
        const promise = [].concat(...removeDocsRefToCate(lsDoc.data, cateId));
        Promise.all(promise)
          .catch(e => logger.error(`[QUERY][CATE]: Remove category at document fail ${e}`));
      }

      return result;
    } catch (error) {
      return handleCategoryError(error);
    }
  },
};