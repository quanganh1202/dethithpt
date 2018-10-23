import { isUndefined } from 'util';
import moment from 'moment';
import ES from '../../elastic';
import logger from '../libs/logger';
import { filterParamsHandler, sortParamsHandler } from '../libs/esHelper';
const type = process.env.ES_TYPE_USER || 'user';
const index = process.env.ES_INDEX_USER || 'users';
const elasticsearch = new ES(index, type);

const handleUserError = (error) => {
  logger.error(`[USER] - ${error.message || error}`);

  return {
    statusCode: error.status || error.code || 500,
    error: 'Unexpected Server Internal Error',
  };
};

export default {
  getOne: async (userId) => {
    try {
      if (!userId) {
        return {
          statusCode: 400,
          error: 'User ID can not be null or undefined',
        };
      }
      const result = await elasticsearch.get(userId);

      return result;
    } catch(error) {
      return handleUserError(error);
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
        school,
        city,
        district,
        role,
        scroll,
        bod,
        status,
        note2,
        note1,
        email,
        level,
        facebook,
        phone,
        position,
        createdAt,
        notifyText,
        notifyStatus,
        numOfUploaded,
        numOfDownloaded,
        blockDownloadCollections,
        blockDownloadCategories,
        blockDownloadSubjects,
        blockDownloadClasses,
        blockDownloadYearSchools,
        money,
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
        school,
        city,
        role,
        district,
        bod,
        status,
        note2,
        class: options.class,
        note1,
        email,
        level,
        facebook,
        phone,
        position,
        createdAt,
        notifyText,
        notifyStatus,
        numOfUploaded,
        numOfDownloaded,
        blockDownloadCollections,
        blockDownloadCategories,
        blockDownloadSubjects,
        blockDownloadClasses,
        blockDownloadYearSchools,
        money,
      });
      if (filterBuilt.statusCode !== 200) return filterBuilt; // Return error
      const fieldsToArray = fields ? fields.split(',') : undefined; // List fields specific by ","
      const from = size && offset && !isScroll ? offset : 0; // Fulfil size and offset to get from value. Default equal 0
      const result = isScroll ?
        await elasticsearch.getInitialScroll( filterBuilt.data, fieldsToArray, sortObj.data, size):
        await elasticsearch.getList(filterBuilt.data, fieldsToArray,  sortObj.data, from, size );

      return result;
    } catch (err) {
      return handleUserError(err);
    }
  },

  getNextPage: async (scrollId) => {
    try {
      const result = await elasticsearch.getNextScroll(scrollId);

      return result;
    } catch (err) {
      return handleUserError(err);
    }
  },

  create: async (userId, body) => {
    try {
      const now = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
      body.createdAt = now;
      body.numOfDownloaded = 0;
      body.numOfUploaded = 0;
      const result = await elasticsearch.insert(body, userId);

      return result;
    } catch (error) {
      return handleUserError(error);
    }
  },

  update: async (userId, body) => {
    try {
      if (!userId) {
        return {
          statusCode: 400,
          error: 'Missing user id',
        };
      }
      const now = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
      body.updatedAt = now;
      const result = await elasticsearch.update(body, userId);
      let updateRef = false;
      let script = '';
      if (body.name) {
        script +=  `ctx._source.userName=${body.name}; `;
      }

      if (body.email) {
        script +=  `ctx._source.userEmail=${body.email}; `;
      }

      if (body.role) {
        script +=  `ctx._source.userRole=${body.role}; `;
      }

      if (updateRef) {
        const document = new ES('documents', 'document');
        document.updateByQuery({
          source: script,
          lang: 'painless',
        },
        {
          match: {
            userId,
          },
        });
      }

      return result;
    } catch (error) {
      return handleUserError(error);
    }
  },

  delete: async (userId) => {
    try {
      if (!userId) {
        return {
          statusCode: 400,
          error: 'Missing user id',
        };
      }
      const result = await elasticsearch.remove(userId);

      return result;
    } catch (error) {
      return handleUserError(error);
    }
  },
};
