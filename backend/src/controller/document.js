import fs from 'fs-extra';
import path from 'path';
import Document from '../model/document';
import { dataValidator } from '../libs/ajv';
import logger from '../libs/logger';
import * as fileHelpers from '../libs/helper';

const docModel = new Document();

async function getListDocuments(args) {
  try {
    const { name, tags, description, searchType, number, offset, sortBy } = args;
    const filter = [];
    filter.push(name ? { name }: undefined);
    filter.push(tags ? { tags: `#${tags}` }: undefined);
    filter.push(description ? { description }: undefined);
    const options = { number, offset, sortBy, searchType };
    const docs = await docModel.getList(filter, options);

    return docs || [];
  } catch (ex) {
    return {
      error: ex.message || 'Unexpected error when get documents',
      status: 500,
    };
  }

}

async function uploadDocument(body, file) {
  try {
    const resValidate = dataValidator(body, 'http://dethithpt.com/document-schema#');
    if (!resValidate.valid) {
      return {
        status: 403,
        error: resValidate.errors,
      };
    }
    if (!file.length) {
      return {
        status: 400,
        error: 'Should be contain any file',
      };
    }
    const { tags } = body;
    body.tags = Array.isArray(tags) ? tags.join(',') : tags;
    const { error, status, fileName } =  fileHelpers.validateExtension(file, body.userId);
    if (error) {
      return {
        error,
        status,
      };
    }
    body.path = fileName;
    const res = await Promise.all([
      docModel.addNewDocument(body),
      fileHelpers.storeFile(file, fileName),
    ]).catch(ex => {
      // TODO: Need to ROLLBACK
      throw ex;
    });

    return {
      status: 201,
      message: `Document created with insertId = ${res[0].insertId}`,
    };
  } catch (ex) {
    logger.error(ex.message || 'Unexpected error when upload file');

    return {
      status: ex.status || 500,
      error: 'Unexpected error when upload file',
    };
  }
}

async function getDocument(id, cols) {
  try {
    const result = await docModel.getDocumentById(id, cols);

    return {
      status: 200,
      data: result,
    };
  } catch (ex) {
    logger.error(ex.message || 'Unexpected error when get document');

    return {
      status: 500,
      error: 'Unexpected error when get document',
    };
  }

}

async function viewContent(fileName) {
  try {
    const filePath = `${process.env.PATH_FOLDER_STORE || path.resolve(__dirname, '../../storage')}/${fileName}`;
    const existed = await fs.pathExists(filePath);
    if (existed) return { status: 200, filePath };
    else return {
      error: 'File not found',
      status: 404,
    };
  } catch (ex) {
    logger.error(ex.message || 'Unexpected error');

    return {
      status: 500,
      error: 'Unexpected error',
    };
  }

}

async function updateDocumentInfo(id, body, file) {
  try { const existed = await docModel.getDocumentById(id);

    if (!existed && !existed.length) {
      return {
        status: 400,
        error: 'Document not found',
      };
    }
    const promise = [];

    if (file && file.length) {
      const { error, status, fileName } =  fileHelpers.validateExtension(file, body.userId);
      if (error)
        return {
          error,
          status,
        };

      body.path = fileName;
      promise.push(fileHelpers.storeFile(file, fileName));
    }

    promise.push(docModel.updateDocumentById(id, body));
    await Promise.all(promise);
    // ? Will delete old file after everything is done ?

    return {
      status: 200,
      message: `Document with id = ${id} is updated`,
    };
  } catch (ex) {
    logger(ex.message || 'Unexpected error');

    return {
      status: ex.status || 500,
      error: 'Unexpected error',
    };
  }
}

export {
  uploadDocument,
  getListDocuments,
  getDocument,
  updateDocumentInfo,
  viewContent,
};