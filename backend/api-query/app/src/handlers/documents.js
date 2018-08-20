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

export default {
  getDocumentById: async (docId) => {
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

  getDocuments: async (options) => {
    const { size, offset, sort, filters, fields } = options;
    const numberRegex = new RegExp(/^[0-9]*$/);
    if (size && offset && (!numberRegex.test(size) || !numberRegex.test(offset))) {
      return {
        statusCode: 400,
        error: 'Size & offset is only allowed to contain digits',
      };
    }
    const sortObj = sort && Array.isArray(sort) ? sort.reduce((pre, cur) => {
      const extractString = cur.split('.');
      if (extractString.length !== 2) {
        throw new Error('Sort param is invalid format');
      }
      pre[extractString[0]] = extractString[1];

      return pre;
    }, {}) : sort ? (() => {
      const sortToArray = sort.split('.');

      return {
        [sortToArray[0]]: sortToArray[1],
      };
    })() : undefined;
    const fieldsToArray = fields ? fields.split('.') : undefined;
    const from = size && offset ? size * (offset - 1) : undefined;
    const result = await elasticsearch.getAll(fieldsToArray, filters, sortObj, from, size );

    return result;
  },
};