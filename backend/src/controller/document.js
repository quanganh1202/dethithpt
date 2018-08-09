import Document from '../model/document';
import { dataValidator } from '../libs/ajv';
import logger from '../libs/logger';

const docModel = new Document();

async function getListDocuments(args) {
  try {
    const { name, tags, description, searchType } = args;
    const filter = [];
    filter.push(name ? { name }: undefined);
    filter.push(tags ? { tags: `#${tags}` }: undefined);
    filter.push(description ? { description }: undefined);
    const options = {};
    if (searchType) options.searchType = searchType;
    const docs = await docModel.getList(filter, options);

    return docs || [];
  } catch (ex) {
    return {
      error: ex.message || 'Unexpected error when get documents',
      status: 500,
    };
  }

}

async function uploadDocument(body) {
  try {
    const resValidate = dataValidator(body, 'http://dethithpt.com/document-schema#');
    if (!resValidate.valid) {
      logger.error('Document validattion false');

      return {
        status: 403,
        error: resValidate.errors,
      };
    }
    const { tags } = body;
    body.tags = tags.join(',');
    body.path = 'TODO path to save content file to hard disk';
    await docModel.addNewDocument(body);

    return {
      status: 201,
      message: 'Created',
    };
  } catch (ex) {
    logger.error(ex.message || 'Unexpected error when upload file');

    return {
      status: ex.status || 500,
      error: 'Unexpected error when upload file',
    };
  }
}

export { uploadDocument, getListDocuments };