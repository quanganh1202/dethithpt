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
  updateNumDocRefToClass,
  updateNumDocRefToSubject,
  updateTagView,
  updateDocumentView,
  updateClassView,
  updateCollectionView,
  updateCateView,
  updateSubjectView,
  updateUserUpload,
} from '../libs/esHelper';
const documentType = process.env.ES_TYPE_DOCUMENT || 'document';
const index = process.env.ES_INDEX_DOCUMENT || 'documents';
const elasticsearch = new ES(index, documentType);

const handleDocumentError = (error) => {
  logger.error(`[DOCUMENT][QUERY] - ${error.message || error}`);

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
      const { tags, collections, cates, subjects, classes } = result.data;
      const promises = [updateDocumentView(docId, constant.INCREASE)];
      if (tags && tags.length) {
        promises.push(updateTagView(tags, constant.INCREASE));
      }
      if (collections && collections.length) {
        updateCollectionView(collections, constant.INCREASE);
      }
      if (cates && cates.length) {
        updateCateView(cates, constant.INCREASE);
      }
      if (subjects && subjects.length) {
        updateSubjectView(subjects, constant.INCREASE);
      }
      if (classes && classes.length) {
        updateClassView(classes, constant.INCREASE);
      }
      await Promise.all(promises).catch(ex => {
        logger.error(`[GET][QUERY] ${ex.message || 'Unexpected error'}`);
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
        approved,
      } = options;
      const numberRegex = new RegExp(/^[0-9]*$/);
      const isScroll = !isUndefined(scroll);
      const approve = isUndefined(approved) ? '1' :
        ['0', '1'].includes(approved.toString()) ? approved.toString() :
          approved.toString() === 'all' ? undefined : '1';
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
        approved: approve,
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
      const { cates, subjects, classes, tags, collections, userId } = body;
      const now = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
      body.createdAt = now;
      body.downloaded = 0;
      await elasticsearch.insert(body, docId);
      const promise = [insertTag(tags), updateUserUpload(userId, constant.INCREASE)];
      if (cates && cates.length && body.approved) {
        const promiseUpdateCates = updateNumDocRefToCate(cates, constant.INCREASE);
        promise.concat([...promiseUpdateCates]);
      }
      if (subjects && subjects.length && body.approved) {
        const promiseUpdateSubjects = updateNumDocRefToSubject(subjects, constant.INCREASE);
        promise.concat([...promiseUpdateSubjects]);
      }
      if (classes && classes.length && body.approved) {
        const promiseUpdateClass = updateNumDocRefToClass(classes, constant.INCREASE);
        promise.concat([...promiseUpdateClass]);
      }
      if (collections && collections.length && body.approved) {
        const promiseUpdateCollections = updateNumDocRefToCollection(collections, constant.INCREASE);
        promise.concat([...promiseUpdateCollections]);
      }
      await Promise.all(promise).catch((err) => {
        logger.error(`[UPLOAD][QUERY] ${err.message || 'Unexpected error'}`);
        if (err.status !== 409) {
          throw err;
        }
      });

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
      const { classes, subjects, cates, collections, tags } = body;
      const now = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
      body.updatedAt = now;
      const promise = [];
      if (!oldDoc.data.approved && body.approved) {
        const { cates, collections } = oldDoc.data;
        if (cates && cates.length) {
          promise.concat(updateNumDocRefToCate(cates, constant.INCREASE));
        }

        if (collections && collections.length) {
          promise.concat(updateNumDocRefToCollection(collections, constant.INCREASE));
        }

        if (classes && classes.length) {
          promise.concat(updateNumDocRefToClass(classes, constant.INCREASE));
        }

        if (subjects && subjects.length) {
          promise.concat(updateNumDocRefToSubject(subjects, constant.INCREASE));
        }
      }
      if (cates && cates.length && oldDoc.data.approved) {
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
        const upCate = updateNumDocRefToCate(increaseCate, constant.INCREASE);
        const downCate = updateNumDocRefToCate(descreaseCate, constant.DECREASE);
        promise.concat([...upCate, ...downCate]);
      }
      if (collections && collections.length && oldDoc.data.approved) {
        const descreaseCollection = oldDoc.data.collections && oldDoc.data.collections.length ? oldDoc.data.collections.reduce((pre, cur) => {
          const ft = _.filter(collections, cur);
          if (!ft.length) {
            pre.push(cur);
          }

          return pre;
        }, []) : [];
        const increaseCollection = collections && collections.length ? collections.reduce((pre, cur) => {
          const ft = _.filter(oldDoc.data.collections, cur);
          if (!ft.length) {
            pre.push(cur);
          }

          return pre;
        }, []): [];
        const upCollection = updateNumDocRefToCollection(increaseCollection, constant.INCREASE);
        const downCollection = updateNumDocRefToCollection(descreaseCollection, constant.DECREASE);
        promise.concat([...upCollection, ...downCollection]);
      }
      if (classes && classes.length && oldDoc.data.approved) {
        const descreaseClass = oldDoc.data.classes && oldDoc.data.classes.length ? oldDoc.data.classes.reduce((pre, cur) => {
          const ft = _.filter(classes, cur);
          if (!ft.length) {
            pre.push(cur);
          }

          return pre;
        }, []) : [];

        const increaseClass = classes && classes.length ? classes.reduce((pre, cur) => {
          const ft = _.filter(oldDoc.data.classes, cur);
          if (!ft.length) {
            pre.push(cur);
          }

          return pre;
        }, []): [];
        const upClasses = updateNumDocRefToClass(increaseClass, constant.INCREASE);
        const downClasses = updateNumDocRefToClass(descreaseClass, constant.DECREASE);
        promise.concat([...upClasses, ...downClasses]);
      }
      if (subjects && subjects.length && oldDoc.data.approved) {
        const descreaseSubject = oldDoc.data.subjects && oldDoc.data.subjects.length ? oldDoc.data.subjects.reduce((pre, cur) => {
          const ft = _.filter(subjects, cur);
          if (!ft.length) {
            pre.push(cur);
          }

          return pre;
        }, []) : [];

        const increaseSubject = subjects && subjects.length ? subjects.reduce((pre, cur) => {
          const ft = _.filter(oldDoc.data.subjects, cur);
          if (!ft.length) {
            pre.push(cur);
          }

          return pre;
        }, []): [];
        const upSubject = updateNumDocRefToSubject(increaseSubject, constant.INCREASE);
        const downSubject = updateNumDocRefToSubject(descreaseSubject, constant.DECREASE);
        promise.concat([...upSubject, ...downSubject]);
      }
      if (tags && tags.length) {
        promise.concat(insertTag(tags));
      }
      // Perform update
      const result = await elasticsearch.update(body, docId);
      await Promise.all(promise).catch(ex => {
        logger.error(`[UPDATE][QUERY] ${ex.message || 'Unexpected error'}`);
        if (ex.status !== 409) {
          throw ex;
        }
      });

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
      const promise = [];
      const oldDoc = await elasticsearch.get(docId);
      if (oldDoc.error) {
        return oldDoc;
      }
      if (oldDoc.data.collections && oldDoc.data.collections.length) {
        promise.push(updateNumDocRefToCollection(oldDoc.data.collections, constant.DECREASE));
      }

      if (oldDoc.data.cates && oldDoc.data.collections.length) {
        promise.push(updateNumDocRefToCate(oldDoc.data.cates, constant.DECREASE));
      }


      if (oldDoc.data.classes && oldDoc.data.classes.length) {
        promise.push(updateNumDocRefToClass(oldDoc.data.classes, constant.DECREASE));
      }


      if (oldDoc.data.subjects && oldDoc.data.subjects.length) {
        promise.push(updateNumDocRefToSubject(oldDoc.data.subjects, constant.DECREASE));
      }
      promise.push(elasticsearch.remove(docId));
      await Promise.all(promise).catch(err => {
        throw err;
      });

      return {
        statusCode: 201,
        message: 'Deleted',
      };
    } catch (error) {
      return handleDocumentError(error);
    }
  },
};