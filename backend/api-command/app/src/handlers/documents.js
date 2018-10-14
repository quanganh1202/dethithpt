import * as fileHelpers from '../libs/helper';
import Document from '../model/document';
import logger from '../libs/logger';
import rabbitSender from '../../rabbit/sender';

const docModel = new Document();
const handleDocumentError = (error) => {
  logger.error(`[DOCUMENT][CONVERT] - ${error.message || error}`);

  return {
    statusCode: error.status || error.code || 500,
    error: 'Unexpected Server Internal Error',
  };
};

export default {
  convert: async (docId, body, queryBody) => {
    try {
      if (!docId) {
        return {
          statusCode: 400,
          error: 'Document ID can not be null or undefined',
        };
      }

      const { filePreview, file, fileName } = body;

      let numPages = 0;
      if (filePreview) {
        // For zip, rar
        const previewFile = file.filter(i => i.fieldname === 'filePreview');
        await fileHelpers.preview(fileName, previewFile);
      } else {
        // For docx, doc, pdf
        const result = await fileHelpers.preview(fileName);
        numPages = result.numPages;
      }

      await docModel.updateDocumentById(docId, {
        totalPages: numPages ? numPages : body.totalPages || 0,
      });

      queryBody.totalPages = numPages ? numPages : body.totalPages || 0;

      const serverNotify = await rabbitSender('document.create', { body: queryBody, id: docId });
      if (serverNotify.statusCode === 200) {
        logger.info('[DOCUMENT]: Upload successful');
      } else {
        // HERE IS CASE API QUERY iS NOT RESOLVED
        // TODO: ROLLBACK HERE
        logger.error(`[DOCUMENT]: ${serverNotify.error}`);
      }

      return {};
    } catch(error) {
      return handleDocumentError(error);
    }
  },
};