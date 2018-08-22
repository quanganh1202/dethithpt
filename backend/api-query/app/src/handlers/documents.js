import ES from '../../elastic';
import logger from '../libs/logger';
const documentType = process.env.ES_DOCUMENT_TYPE || 'documents';
const index = process.env.ES_INDEX || 'dethithpt';
const elasticsearch = new ES(index, documentType);

const handleDocumentError = (error) => {
  logger.error(`[DOCUMENT] - ${error.message || error}`);

  return {
    statusCode: error.status || error.code || 500,
    error: 'Unexpected Server Internal Error',
  };
};

const filterParamsHandler = (filters) => {
  try {
    const filterForSearch = filters && Array.isArray(filters) ? filters.reduce((pre, cur) => {
      const pair = cur.split('.');
      pre[pair[0]] = pair[1];
      if (pair.length !== 2) {
        throw new Error('Filter param is invalid format');
      }

      return pre;
    }, {}) : filters ? (() => {
      const pair = filters.split('.');
      if (pair.length !== 2) {
        throw new Error('Filter param is invalid format');
      }

      return {
        [pair[0]]: pair[1],
      };
    })() : undefined;

    return {
      statusCode: 200,
      data: filterForSearch,
    };
  } catch (e) {
    logger.error(`[DOCUMENT] - ${e.message || e}`);

    return {
      statusCode: 400,
      error: e.message,
    };
  }
};

const sortParamsHandler = (sort) => {
  try {
    const sortForSearch = sort && Array.isArray(sort) ? sort.reduce((pre, cur) => {
      const extractString = cur.split('.');
      if (extractString.length !== 2) {
        throw new Error('Sort param is invalid format');
      }
      pre[extractString[0]] = extractString[1];

      return pre;
    }, {}) : sort ? (() => {
      const sortToArray = sort.split('.');
      if (sortToArray.length !== 2) {
        throw new Error('Sort param is invalid format');
      }

      return {
        [sortToArray[0]]: sortToArray[1],
      };
    })() : undefined;

    return {
      statusCode: 200,
      data: sortForSearch,
    };
  } catch (e) {
    logger.error(`[DOCUMENT] - ${e.message || e}`);

    return {
      statusCode: 400,
      error: e.message,
    };
  }
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
      const { size, offset, sort, filters, fields } = options;
      const numberRegex = new RegExp(/^[0-9]*$/);
      if (size && offset && (!numberRegex.test(size) || !numberRegex.test(offset))) {
        return {
          statusCode: 400,
          error: 'Size & offset is only allowed to contain digits',
        };
      }
      const sortObj = sortParamsHandler(sort);
      if (sortObj.statusCode !== 200) return sortObj; // Return error
      const filterBuilt = filterParamsHandler(filters);
      if (filterBuilt.statusCode !== 200) return filterBuilt; // Return error
      const fieldsToArray = fields ? fields.split('.') : undefined;
      const from = size && offset ? size * (offset - 1) : undefined;
      const result = await elasticsearch.getAll(fieldsToArray, filterBuilt.data, sortObj.data, from, size );

      return result;
    } catch (err) {
      return handleDocumentError(err);
    }
  },

  create: async (docId, body) => {
    try {
      const result = await elasticsearch.insert(docId, body);

      return result;
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
      const result = await elasticsearch.insert(docId, body);

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
      const result = await elasticsearch.insert(docId);

      return result;
    } catch (error) {
      return handleDocumentError(error);
    }
  },
};