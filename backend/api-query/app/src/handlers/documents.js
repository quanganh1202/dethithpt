import { isUndefined } from 'util';
import moment from 'moment';
import ES from '../../elastic';
import logger from '../libs/logger';
import constant from '../constant/common';
import {
  filterParamsHandler,
  sortParamsHandler,
  insertTag,
  updateNumDocRefToCate,
  updateNumDocRefToCollection,
} from '../libs/esHelper';
const documentType = process.env.ES_TYPE_DOCUMENT || 'document';
const index = process.env.ES_INDEX_DOCUMENT || 'documents';
const elasticsearch = new ES(index, documentType);

const handleDocumentError = (error) => {
  logger.error(`[DOCUMENT] - ${error.message || error}`);

  return {
    statusCode: error.status || error.code || 500,
    error: 'Unexpected Server Internal Error',
  };
};

export default {
  getOne: async (docId) => {
    try {
      if (!docId) {
        return {
          statusCode: 400,
          error: 'Document ID can not be null or undefined',
        };
      }
      const result = await elasticsearch.get(docId);

      return result;
    } catch(error) {
      return handleDocumentError(error);
    }
  },

  getList: async (options) => {
    try {
      const {
        size,
        offset,
        sort,
        fields,
        cateName,
        cateId,
        subjectName,
        subjectId,
        className,
        classId,
        yearSchool,
        name,
        price,
        tags,
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
        tags,
        'cates.cateName': cateName,
        'cates.cateId': cateId,
        subjectName,
        subjectId,
        className,
        classId,
        yearSchool,
        name,
        price,
      });
      if (filterBuilt.statusCode !== 200) return filterBuilt; // Return error
      const fieldsToArray = fields ? fields.split(',') : undefined; // List fields specific by ","
      const from = size && offset && !isScroll ? offset : 0; // Fulfil size and offset to get from value. Default equal 0
      const result = isScroll ?
        await elasticsearch.getInitialScroll(filterBuilt.data, fieldsToArray, sortObj.data, size):
        await elasticsearch.getList(filterBuilt.data, fieldsToArray, sortObj.data, from, size );

      return result;
    } catch (err) {
      return handleDocumentError(err);
    }
  },

  getNextPage: async (scrollId) => {
    try {
      const result = await elasticsearch.getNextScroll(scrollId);

      return result;
    } catch (err) {
      return handleDocumentError(err);
    }
  },

  create: async (docId, body) => {
    try {
      const { cates, tags, collectionId } = body;
      const now = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
      body.createdAt = now;
      const promise = [];
      await elasticsearch.insert(body, docId);
      if (cates && cates.length) {
        const promiseUpdateCates = updateNumDocRefToCate(cates, constant.INCREASE);
        promise.concat([...promiseUpdateCates, insertTag(tags)]);
      }
      if (collectionId) {
        promise.push(updateNumDocRefToCollection(collectionId, constant.INCREASE));
      }
      await Promise.all(promise);

      return { statusCode: 200 };
    } catch (error) {
      return handleDocumentError(error);
    }
  },

  update: async (docId, body) => {
    try {
      if (!docId) {
        return {
          statusCode: 400,
          error: 'Missing document id',
        };
      }
      const now = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
      body.updatedAt = now;
      // Perform update
      const result = await elasticsearch.update(body, docId);

      return result[0];
    } catch (error) {
      return handleDocumentError(error);
    }
  },

  delete: async (docId) => {
    try {
      if (!docId) {
        return {
          statusCode: 400,
          error: 'Missing document id',
        };
      }
      const result = elasticsearch.remove(docId);

      return result[0];
    } catch (error) {
      return handleDocumentError(error);
    }
  },
};