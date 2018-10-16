import { isUndefined } from 'util';
import moment from 'moment';
import ES from '../../elastic';
import logger from '../libs/logger';
import { filterParamsHandler, sortParamsHandler, removeDocsRefToClass, updateDocsRefToClass } from '../libs/esHelper';
const type = process.env.ES_TYPE_CLASS || 'class';
const index = process.env.ES_INDEX_CLASS || 'classes';
const elasticsearch = new ES(index, type);

const handleCategoryError = (error) => {
  logger.error(`[CLASS] - ${error.message || error}`);

  return {
    statusCode: error.status || error.code || 500,
    error: 'Unexpected Server Internal Error',
  };
};

export default {
  getOne: async (classId) => {
    try {
      if (!classId) {
        return {
          statusCode: 400,
          error: 'Class ID can not be null or undefined',
        };
      }
      const result = await elasticsearch.get(classId);

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
        userName,
        name,
        priority,
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
      const filterBuilt = filterParamsHandler({ name, userName, priority });
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

  create: async (classId, body) => {
    try {
      body.view = 0;
      const now = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
      body.createdAt = now;
      body.numDocRefs = 0;
      body.position = !body.position ? 0 : body.position;
      body.priority = !body.priority ? 0 : body.priority;
      const result = await elasticsearch.insert(body, classId);

      return result;
    } catch (error) {
      return handleCategoryError(error);
    }
  },

  update: async (classId, body) => {
    try {
      if (!classId) {
        return {
          statusCode: 400,
          error: 'Missing class id',
        };
      }
      const now = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
      body.updatedAt = now;
      if (body.name) {
        // Update all docs ref to this collection
        const filterBuilt = filterParamsHandler({
          'classes.classId': classId,
        });
        const docES = new ES('documents', 'document');
        const lsDoc = await docES.getList(filterBuilt.data);
        // Process if have doc ref to this collection
        if (lsDoc.total) {
          const promise = [].concat(...updateDocsRefToClass(lsDoc.data, classId, body.name));
          Promise.all(promise)
            .catch(e => logger.error(`[QUERY][CLASS]: Update class at document fail ${e}`));
        }
      }
      const result = await elasticsearch.update(body, classId);

      return result;
    } catch (error) {
      return handleCategoryError(error);
    }
  },

  delete: async (classId) => {
    try {
      if (!classId) {
        return {
          statusCode: 400,
          error: 'Missing class id',
        };
      }
      const result = await elasticsearch.remove(classId);
      const docES = new ES('documents', 'document');
      const filterBuilt = filterParamsHandler({
        'classes.classId': classId,
      });
      const lsDoc = await docES.getList(filterBuilt.data);
      if (lsDoc.total) {
        const promise = [].concat(...removeDocsRefToClass(lsDoc.data, classId));
        Promise.all(promise)
          .catch(e => logger.error(`[QUERY][CLASS]: Remove class at document fail ${e}`));
      }

      return result;
    } catch (error) {
      return handleCategoryError(error);
    }
  },
};