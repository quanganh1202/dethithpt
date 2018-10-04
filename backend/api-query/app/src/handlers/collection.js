import { isUndefined } from 'util';
import moment from 'moment';
import ES from '../../elastic';
import logger from '../libs/logger';
import { filterParamsHandler, sortParamsHandler } from '../libs/esHelper';
const type = process.env.ES_TYPE_COLLECTION || 'collection';
const index = process.env.ES_INDEX_COLLECTION || 'collections';
const elasticsearch = new ES(index, type);

const handleCollectionError = (error) => {
  logger.error(`[COLLECTION] - ${error.message || error}`);

  return {
    statusCode: error.status || error.code || 500,
    error: 'Unexpected Server Internal Error',
  };
};

export default {
  getOne: async (collectionId) => {
    try {
      if (!collectionId) {
        return {
          statusCode: 400,
          error: 'Collection ID can not be null or undefined',
        };
      }
      const result = await elasticsearch.get(collectionId);

      return result;
    } catch(error) {
      return handleCollectionError(error);
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
        cateName,
        cateId,
        subjectName,
        subjectId,
        className,
        classId,
        description,
        yearSchools,
        userName,
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
      const filterBuilt = filterParamsHandler({
        name,
        'cates.cateName': cateName,
        'cates.cateId': cateId,
        'subjects.subjectName': subjectName,
        'subjects.subjectId': subjectId,
        'classes.className': className,
        'classes.classId': classId,
        userName,
        userId,
        description,
        yearSchools,
      });
      if (filterBuilt.statusCode !== 200) return filterBuilt; // Return error
      const fieldsToArray = fields ? fields.split(',') : undefined; // List fields specific by ","
      const from = size && offset && !isScroll ? offset : 0; // Fulfil size and offset to get from value. Default equal 0
      const result = isScroll ?
        await elasticsearch.getInitialScroll( filterBuilt.data, fieldsToArray, sortObj.data, size):
        await elasticsearch.getList(filterBuilt.data, fieldsToArray,  sortObj.data, from, size );

      return result;
    } catch (err) {
      return handleCollectionError(err);
    }
  },

  getNextPage: async (scrollId) => {
    try {
      const result = await elasticsearch.getNextScroll(scrollId);

      return result;
    } catch (err) {
      return handleCollectionError(err);
    }
  },

  create: async (collectionId, body) => {
    try {
      body.view = 0;
      const now = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
      body.createdAt = now;
      body.numDocRefs = 0;
      const result = await elasticsearch.insert(body, collectionId);

      return result;
    } catch (error) {
      return handleCollectionError(error);
    }
  },

  update: async (collectionId, body) => {
    try {
      if (!collectionId) {
        return {
          statusCode: 400,
          error: 'Missing collection id',
        };
      }
      const now = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
      body.updatedAt = now;
      const result = await elasticsearch.update(body, collectionId);

      return result;
    } catch (error) {
      return handleCollectionError(error);
    }
  },

  delete: async (collectionId) => {
    try {
      if (!collectionId) {
        return {
          statusCode: 400,
          error: 'Missing collection id',
        };
      }
      const result = await elasticsearch.remove(collectionId);

      return result;
    } catch (error) {
      return handleCollectionError(error);
    }
  },
};