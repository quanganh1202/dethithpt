import { isUndefined } from 'util';
import _ from 'lodash';
import fs from 'fs-extra';
import path from 'path';
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
  updateTagView,
  updateDocumentView,
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
      if (result.error) {
        return result;
      }
      const { tags } = result.data;
      await updateDocumentView(docId, constant.INCREASE);
      const promises = updateTagView(tags, constant.INCREASE);
      await Promise.all(promises).catch(ex => {
        // Ignore error data conflic version [409]
        if (ex.status !== 409) {
          throw ex;
        }
      });

      return result;
    } catch(error) {
      return handleDocumentError(error);
    }
  },

  getPreview: async (docId) => {
    try {
      if (!docId) {
        return {
          statusCode: 400,
          error: 'Document ID can not be null or undefined',
        };
      }
      const result = await elasticsearch.get(docId);
      if (!result || !result.data) {
        return result;
      }
      const file = result.data.path;
      const dirname = path.dirname(file);
      const ext = path.extname(file);
      const filename = path.basename(file, ext);
      const filePreview = fs.readdirSync(dirname)
        .filter(i => i.includes(filename) && !i.includes(ext))
        .map(i => path.join(dirname, i));

      return {
        statusCode: 200,
        filePreview,
      };
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
        description,
        subjectId,
        className,
        classId,
        yearSchools,
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
        description,
        tags,
        'cates.cateName': cateName,
        'cates.cateId': cateId,
        'subjects.subjectName': subjectName,
        'subjects.subjectId': subjectId,
        'classes.className': className,
        'classes.classId': classId,
        yearSchools,
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
      const { cates, tags, collections } = body;
      const now = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
      body.createdAt = now;
      await elasticsearch.insert(body, docId);
      const promise = [insertTag(tags)];
      if (cates && cates.length) {
        const promiseUpdateCates = updateNumDocRefToCate(cates, constant.INCREASE);
        promise.concat([...promiseUpdateCates]);
      }
      if (collections && collections.length) {
        const promiseUpdateCollections = updateNumDocRefToCollection(collections, constant.INCREASE);
        promise.concat([...promiseUpdateCollections]);
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
      const oldDoc = await elasticsearch.get(docId);
      if (oldDoc.error) {
        return oldDoc;
      }
      const { cates, collections } = body;
      const now = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
      body.updatedAt = now;
      const promise = [];
      const descreaseCate = oldDoc.data.cates && oldDoc.data.cates.length ? oldDoc.data.cates.reduce((pre, cur) => {
        const ft = _.filter(cates, cur);
        if (!ft.length) {
          pre.push(cur);
        }

        return pre;
      }, []) : [];

      const increaseCate = cates && cates.length ? cates.reduce((pre, cur) => {
        const ft = _.filter(oldDoc.data.cates, cur);
        if (!ft.length) {
          pre.push(cur);
        }

        return pre;
      }, []): [];

      const descreaseCollection = oldDoc.data.collections && oldDoc.data.collections.length ? oldDoc.data.collections.reduce((pre, cur) => {
        const ft = _.filter(collections, cur);
        if (!ft.length) {
          pre.push(cur);
        }

        return pre;
      }, []) : [];

      const increaseCollection = collections && collections.length ? cates.reduce((pre, cur) => {
        const ft = _.filter(oldDoc.data.collections, cur);
        if (!ft.length) {
          pre.push(cur);
        }

        return pre;
      }, []): [];
      if (cates && cates.length) {
        const upCate = updateNumDocRefToCate(increaseCate, constant.INCREASE);
        const downCate = updateNumDocRefToCate(descreaseCate, constant.DECREASE);
        promise.concat([...upCate, ...downCate]);
      }
      if (collections && collections.length) {
        const upCollection = updateNumDocRefToCollection(increaseCollection, constant.INCREASE);
        const downCollection = updateNumDocRefToCollection(descreaseCollection, constant.DECREASE);
        promise.concat([...upCollection, ...downCollection]);
      }
      // Perform update
      const result = await elasticsearch.update(body, docId);
      await Promise.all(promise);

      return result;
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
      const oldDoc = await elasticsearch.get(docId);
      if (oldDoc.error) {
        return oldDoc;
      }
      if (oldDoc.data.collections && oldDoc.data.collections.length) {
        await updateNumDocRefToCollection(oldDoc.data.collections, constant.DECREASE);
      }
      await elasticsearch.remove(docId);

      return {
        statusCode: 201,
        message: 'Deleted',
      };
    } catch (error) {
      return handleDocumentError(error);
    }
  },
};