import fs from 'fs-extra';
import path from 'path';
import Document from '../model/document';
import User from '../model/user';
import Category from '../model/category';
import Subject from '../model/subject';
import Class from '../model/class';
import Collection from '../model/collection';
import { dataValidator } from '../libs/ajv';
import logger from '../libs/logger';
import * as fileHelpers from '../libs/helper';
import { exception } from '../constant/error';
import rabbitSender from '../../rabbit/sender';

const docModel = new Document();
const schemaId = 'http://dethithpt.com/document-schema#';

async function getListDocuments(args) {
  try {
    const { name, tags, description, searchType, number, offset, sortBy, cols } = args;
    const filter = [];
    filter.push(name ? { name }: undefined);
    filter.push(tags ? { tags: `#${tags}` }: undefined);
    filter.push(description ? { description }: undefined);
    const options = { number, offset, sortBy, searchType, cols };
    const result = await Promise.all([
      docModel.getList(filter, options),
      docModel.getCount(),
    ]);

    return {
      docs: result[0],
      total: result[1][0]['COUNT(*)'],
      status: 200,
    };
  } catch (ex) {
    return {
      error: ex.message || 'Unexpected error when get documents',
      status: 500,
    };
  }
}

async function uploadDocument(body, file) {
  try {
    const resValidate = dataValidator(body, schemaId);
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
    const { tags, cates, subjectId, classId, collectionId, userId } = body;
    const userModel = new User();
    const user = await userModel.getById(userId);
    if (!user || !user.length || !user[0].status) {
      return {
        status: 400,
        error: 'User id does not exists',
      };
    }

    let newCate;
    if (cates && cates.length) {
      const cateModel = new Category();
      const promises = Array.isArray(cates) ?
        cates.map(cateId => cateModel.getCategoryById(cateId)) :
        cates.split(',').map(cateId => cateModel.getCategoryById(cateId));
      const categories = await Promise.all(promises);
      // Will replace cates by an array with more than infomation
      newCate = categories.map(cate => {
        if (!cate || !cate.length) {
          throw {
            status: 400,
            error: 'Category id does not exists',
          };
        }

        return {
          cateId: cate[0].id,
          cateName: cate[0].name,
        };
      });
    }
    const subModel = new Subject();
    const subject = await subModel.getSubjectById(subjectId);
    if (!subject || !subject.length) {
      return {
        status: 400,
        error: 'Subject id does not exists',
      };
    }
    const classModel = new Class();
    const _class = await classModel.getClassById(classId);
    if (!_class || !_class.length) {
      return {
        status: 400,
        error: 'Class id does not exists',
      };
    }
    const collectionModel = new Collection();
    const collection = await collectionModel.getCollectionById(collectionId);
    if (!collection || !collection.length) {
      return {
        status: 400,
        error: 'Collection id does not exists',
      };
    }
    body.tags = Array.isArray(tags) ? tags.join(',') : tags;
    body.cates = Array.isArray(cates) ? cates.join(',') : cates;
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

    // Append data and send to query api
    body.className = _class[0].name;
    body.collectionName = collection[0].name;
    body.subjectName =subject[0].name;
    body.userName = user[0].name;
    body.cates = newCate;
    body.tags = body.tags.split(',').map(tag => ({
      tagId: tag,
      tagText: tag,
    }));
    await rabbitSender('document.create', { body, id: res[0].insertId });

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
    const result = await docModel.getDocumentById(id,  cols);

    return {
      status: 200,
      data: result,
    };
  } catch (ex) {
    logger.error(ex.message || 'Unexpected error when get document');

    return exception;
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

    return exception;
  }

}

async function updateDocumentInfo(id, body, file) {
  try {
    const existed = await docModel.getDocumentById(id);
    const newBody = Object.assign({}, body);

    if (!existed || !existed.length) {
      return {
        status: 400,
        error: 'Document not found',
      };
    }
    const { tags, cates, subjectId, classId, collectionId } = body;

    if (cates && cates.length) {
      const cateModel = new Category();
      const promises = cates.map(cateId => cateModel.getCategoryById(cateId));
      const categories = await Promise.all(promises);
      // Will replace cates by an array with more than infomation
      newBody.cates = categories.map(cate => {
        if (!cate || !cate.length) {
          throw {
            status: 400,
            error: 'Category id does not exists',
          };
        }

        return {
          cateId: cate.id,
          cateName: cate.name,
        };
      });
    }

    if(subjectId) {
      const subModel = new Subject();
      const subject = await subModel.getSubjectById(subjectId);
      if (!subject || !subject.length) {
        return {
          status: 400,
          error: 'Subject id does not exists',
        };
      }
      newBody.subjectName = subject[0].name;
    }

    if (classId) {
      const classModel = new Class();
      const _class = await classModel.getClassById(classId);
      if (!_class || !_class.length) {
        return {
          status: 400,
          error: 'Class id does not exists',
        };
      }
      newBody.subjectName = _class[0].name;
    }

    if (collectionId) {
      const collectionModel = new Collection();
      const collection = await collectionModel.getCollectionById(collectionId);
      if (!collection || !collection.length) {
        return {
          status: 400,
          error: 'Collection id does not exists',
        };
      }
      newBody.collectionName = collection[0].name;
    }

    if (tags) {
      newBody.tags = tags.split(',').map(tag => ({
        tagId: tag,
        tagText: tag,
      }));
      body.tags = Array.isArray(tags) ? tags.join(',') : tags;
    }

    const promise = [docModel.updateDocumentById(id, body)];

    if (file && file.length) {
      const { error, status, fileName } =  fileHelpers.validateExtension(file, id);
      if (error)
        return {
          error,
          status,
        };

      body.path = fileName;
      promise.concat([
        fileHelpers.storeFile(file, fileName),
        fileHelpers.removeFile(existed[0].path),
      ]);
    }
    await Promise.all(promise).catch((ex) => { throw ex; });
    await rabbitSender('document.update', { body: newBody, id });

    return {
      status: 200,
      message: `Document with id = ${id} is updated`,
    };
  } catch (ex) {
    logger(ex.message || 'Unexpected error');

    return exception;
  }
}

async function deleteDocument(id) {
  try {
    const result = await docModel.getDocumentById(id);

    if (!result || !result.length) {
      return {
        error: 'Document not found',
        status: 404,
      };
    }

    await Promise.all([
      docModel.deleteDocumentById(id),
      fileHelpers.removeFile(result[0].path),
    ]);

    return {
      status: 200,
      message: 'Deleted',
    };
  } catch (ex) {
    logger.error(ex.message || 'Unexpect error when delete file');

    return exception;
  }
}

export {
  uploadDocument,
  getListDocuments,
  getDocument,
  updateDocumentInfo,
  viewContent,
  deleteDocument,
};