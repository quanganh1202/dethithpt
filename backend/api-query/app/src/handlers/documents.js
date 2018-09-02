import { isUndefined } from 'util';
import moment from 'moment';
import ES from '../../elastic';
import logger from '../libs/logger';
import {
  filterParamsHandler,
  sortParamsHandler,
  removeCateRefToDoc,
  removeTagRefToDoc,
  insertToCateDoc,
  insertToTagDoc,
  insertTag,
} from '../libs/esHelper';
const documentType = process.env.ES_DOCUMENT_TYPE || 'document';
const index = process.env.ES_INDEX || 'documents';
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
        category,
        subject,
        classes,
        yearSchool,
        name,
        price,
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
      const filterBuilt = filterParamsHandler({ category, subject, classes, yearSchool, name, price });
      if (filterBuilt.statusCode !== 200) return filterBuilt; // Return error
      const fieldsToArray = fields ? fields.split(',') : undefined; // List fields specific by ","
      const from = size && offset && !isScroll ? size * (offset - 1) : 0; // Fulfil size and offset to get from value. Default equal 0
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
      const { cates, tags } = body;
      const now = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
      body.createdAt = now;
      const { createdId } = await elasticsearch.insert(body, docId);
      const promiseCateDocRefs = insertToCateDoc(createdId, cates, now);
      const promiseTagDocRefs = insertToTagDoc(createdId, tags, now);
      await Promise.all([...promiseCateDocRefs, ...promiseTagDocRefs, insertTag(tags)]);

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
      const { cates, tags } = body;
      const now = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
      body.updatedAt = now;
      // Perform update
      const result = await elasticsearch.update(body, docId);
      const promisesRemove = [];
      const promiseInsert = [];
      // Update tags on ref table if user update tags for document
      if (tags) {
        promisesRemove.push(removeTagRefToDoc(docId));
        promiseInsert.concat(insertToTagDoc(docId, tags, now));
      }
      // The same to tags
      if (cates) {
        promisesRemove.push(removeCateRefToDoc(docId));
        promiseInsert.concat(insertToCateDoc(docId, cates, now));
      }
      // Need to clean all the tags ref to docId before insert new tags
      await Promise.all(promisesRemove);
      // Insert new tags
      await Promise.all(promiseInsert);

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
      const result = await Promise.all([
        elasticsearch.remove(docId),
        removeTagRefToDoc(docId),
        removeCateRefToDoc(docId),
      ]);

      await Promise.all([
        removeTagRefToDoc(docId),
        removeCateRefToDoc(docId),
      ]); // Remove all tags & cate refer to this doc

      return result[0];
    } catch (error) {
      return handleDocumentError(error);
    }
  },
};