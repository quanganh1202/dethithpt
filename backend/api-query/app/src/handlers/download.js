import { isUndefined } from 'util';
import moment from 'moment';
import ES from '../../elastic';
import logger from '../libs/logger';
import { updateDocumentDownload, updateUserDownload } from '../libs/esHelper';
import constant from '../constant/common';
import { filterParamsHandler, sortParamsHandler } from '../libs/esHelper';
const type = process.env.ES_TYPE_DOWNLOAD || 'download';
const index = process.env.ES_INDEX_DOWNLOAD || 'downloads';
const elasticsearch = new ES(index, type);

const handleDownloadError = (error) => {
  logger.error(`[DOWNLOAD] - ${error.message || error}`);

  return {
    statusCode: error.status || error.code || 500,
    error: 'Unexpected Server Internal Error',
  };
};

export default {
  getList: async (options) => {
    try {
      const {
        size,
        offset,
        sort,
        fields,
        userId,
        userName,
        docId,
        docName,
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
      const filterBuilt = filterParamsHandler({ userId, userName, docId, docName });
      if (filterBuilt.statusCode !== 200) return filterBuilt; // Return error
      const fieldsToArray = fields ? fields.split(',') : undefined; // List fields specific by ","
      const from = size && offset && !isScroll ? offset : 0; // Fulfil size and offset to get from value. Default equal 0
      const result = isScroll ?
        await elasticsearch.getInitialScroll( filterBuilt.data, fieldsToArray, sortObj.data, size):
        await elasticsearch.getList(filterBuilt.data, fieldsToArray,  sortObj.data, from, size );

      return result;
    } catch (err) {
      return handleDownloadError(err);
    }
  },

  getNextPage: async (scrollId) => {
    try {
      const result = await elasticsearch.getNextScroll(scrollId);

      return result;
    } catch (err) {
      return handleDownloadError(err);
    }
  },

  create: async (id, body) => {
    try {
      const { docId, userId } = body;
      body.createdAt = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
      await Promise.all([
        updateDocumentDownload(docId, constant.INCREASE),
        updateUserDownload(userId, constant.INCREASE),
      ]).catch((err) => {
        logger.error(err.message || '[DOWNLOAD][QUERY] Unexpected error when during process download');

        return {
          statusCode: 500,
          error: '[QUERY] Unexpected error when during process download',
        };
      });
      await elasticsearch.insert(body);

      return {
        statusCode: 200,
        message: 'Done',
      };
    } catch (error) {
      return handleDownloadError(error);
    }
  },
};