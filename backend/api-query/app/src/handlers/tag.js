import ES from '../../elastic';
import logger from '../libs/logger';
import { filterParamsHandler, sortParamsHandler } from '../libs/esHelper';
const type = process.env.ES_TYPE_TAGDOCREF || 'tagDocRef';
const index = process.env.ES_INDEX_TAGDOCREF || 'tagdocrefs';
const elasticsearch = new ES(index, type);

const handleTagError = (error) => {
  logger.error(`[TAG] - ${error.message || error}`);

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
        tagId,
        docName,
        docId,
      } = options;
      const numberRegex = new RegExp(/^[0-9]*$/);
      const withoutZeroRegex = new RegExp(/^(0)$/);
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
      const filterBuilt = filterParamsHandler({ tagId, docName, docId });
      console.log('filterBuilt', JSON.stringify(filterBuilt));
      if (filterBuilt.statusCode !== 200) return filterBuilt; // Return error
      const fieldsToArray = fields ? fields.split(',') : undefined; // List fields specific by ","
      const from = size && offset ? size * (offset - 1) : 0; // Fulfil size and offset to get from value. Default equal 0
      const result = await elasticsearch.getList(filterBuilt.data, fieldsToArray, sortObj.data, from, size );

      return result;
    } catch (err) {
      return handleTagError(err);
    }
  },
};