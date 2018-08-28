import { isUndefined } from 'util';
import moment from 'moment';
import ES from '../../elastic';
import logger from '../libs/logger';
import { filterParamsHandler, sortParamsHandler } from '../libs/esHelper';
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

const insertToCateDoc = (docId, cates = [], createdAt) => {
  const cateDocRefs = new ES('catedocrefs', 'cateDocRef');
  const promiseCateDocRefs = cates.map((cate) => {
    return cateDocRefs.insert({
      cateId: cate.cateId,
      cateName: cate.cateName,
      docId,
      createdAt,
    });
  });

  return promiseCateDocRefs;
};

const insertToTagDoc = (docId, tags, createdAt) => {
  const tagDocRefs = new ES('tagdocrefs', 'tagDocRef');
  const promiseTagDocRefs = tags.map((tag) => {
    return tagDocRefs.insert({
      tagId: tag.tagId,
      docId,
      createdAt,
    });
  });

  return promiseTagDocRefs;
};

const removeCateRefToDoc = (docId) => {
  const filters = filterParamsHandler({ docId });
  const cateDocRefs = new ES('catedocrefs', 'cateDocRef');

  return cateDocRefs.deleteByQuery(filters);
};

const removeTagRefToDoc = (docId) => {
  const filters = filterParamsHandler({ docId });
  const tagDocRefs = new ES('tagdocrefs', 'tagDocRef');

  return tagDocRefs.deleteByQuery(filters);
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
        await elasticsearch.getInitialScroll(fieldsToArray, filterBuilt.data, sortObj.data, size):
        await elasticsearch.getAll(fieldsToArray, filterBuilt.data, sortObj.data, from, size );

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

  create: async (body, id) => {
    try {
      const { cates, tags } = body;
      const now = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
      body.createdAt = now;
      const { createdId } = await elasticsearch.insert(body, id);
      const promiseCateDocRefs = insertToCateDoc(createdId, cates, now);
      const promiseTagDocRefs = insertToTagDoc(createdId, tags, now);
      await Promise.all([...promiseCateDocRefs, ...promiseTagDocRefs]);

      return { statusCode: 200 };
    } catch (error) {
      return handleDocumentError(error);
    }
  },

  update: async (body, docId) => {
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
        promiseInsert.concat(insertToCateDoc(docId, cates, now));
      }
      // The same to tags
      if (cates) {
        promisesRemove.push(removeCateRefToDoc(docId));
        promiseInsert.concat(insertToTagDoc(docId, tags, now));
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

      return result[0];
    } catch (error) {
      return handleDocumentError(error);
    }
  },
};