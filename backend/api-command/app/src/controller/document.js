import path from 'path';
import pdfjs from 'pdfjs-dist/build/pdf';
import pageCounter from 'docx-pdf-pagecount';
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
import action from '../constant/action';

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
    if (!body.price) body.price = '0';
    body.approved = 0;
    const queryBody = Object.assign({}, body);
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

    const { tags, cateIds, subjectId, classId, collectionId, userId } = body;
    const userModel = new User();
    const user = await userModel.getById(userId);
    if (!user || !user.length || !user[0].status) {
      return {
        status: 400,
        error: 'User id does not exists',
      };
    }

    let newCate;
    if (cateIds && cateIds.length) {
      const cateModel = new Category();
      const promises = Array.isArray(cateIds) ?
        cateIds.map(cateId => cateModel.getCategoryById(cateId)) :
        cateIds.split(',').map(cateId => cateModel.getCategoryById(cateId));

      const categories = await Promise.all(promises);
      // Will replace cates by an array with more than infomation
      newCate = categories.map((cate, i) => {
        if (!cate || !cate.length) {
          throw {
            status: 400,
            error: `Category id ${cateIds.split(',')[i]} does not exists`,
          };
        }

        return {
          cateId: cate[0].id,
          cateName: cate[0].name,
        };
      });
      delete queryBody.cateIds;
      queryBody.cates = newCate;
    }

    if (subjectId) {
      const subModel = new Subject();
      const subject = await subModel.getSubjectById(subjectId);
      if (!subject || !subject.length) {
        return {
          status: 400,
          error: 'Subject id does not exists',
        };
      }

      queryBody.subjectName =subject[0].name;
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

      queryBody.className = _class[0].name;
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

      queryBody.collectionName = collection[0].name;
    }

    body.tags = Array.isArray(tags) ? tags.map(tag => tag.trim()).join(',') : tags.split(',').map(tag => tag.trim()).join(',');
    body.cateIds = Array.isArray(cateIds) ? cateIds.join(',') : cateIds;
    const { error, status, fileName } =  fileHelpers.validateExtension(file, body.userId);
    if (error) {
      return {
        error,
        status,
      };
    }
    body.path = fileName;
    queryBody.path = fileName;
    queryBody.view = 1;
    await fileHelpers.storeFile(file, fileName);
    await fileHelpers.preview(fileName);
    const extension = file[0].originalname.split('.').pop();
    const { numPages } = extension === 'pdf' ?
      await pdfjs.getDocument(path.resolve(__dirname, fileName)) :
      { numPages: await pageCounter(path.resolve(__dirname, fileName)) };
    body.totalPages = numPages;
    queryBody.totalPages = numPages;
    const res = await docModel.addNewDocument(body);
    // Append data and send to query api
    queryBody.userName = user[0].name;
    queryBody.tags = body.tags.split(',');
    const serverNotify = await rabbitSender('document.create', { body: queryBody, id: res.insertId });
    if (serverNotify.statusCode === 200) {
      return {
        status: 201,
        message: `Document created with insertId = ${res.insertId}`,
      };
    } else {
      // HERE IS CASE API QUERY iS NOT RESOLVED
      // TODO: ROLLBACK HERE
      logger.error(`[DOCUMENT]: ${serverNotify.error}`);

      return {
        status: serverNotify.statusCode,
        message: serverNotify.error,
      };
    }
  } catch (ex) {
    logger.error(ex.message || ex.error || 'Unexpected error when upload file');

    return {
      status: ex.status || ex.statusCode || 500,
      error: ex.error || 'Unexpected error when upload file',
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

    const { tags, catesId, subjectId, classId, collectionId } = body;

    if (catesId && catesId.length) {
      const cateModel = new Category();
      const promises = catesId.map(cateId => cateModel.getCategoryById(cateId));
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
      body.tags = Array.isArray(tags) ? tags.map(tag => tag.trim()).join(',') : tags.split(',').map(tag => tag.trim()).join(',');
      newBody.tags = body.tags.split(',');
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
    const serverNotify = await rabbitSender('document.update', { body: newBody, id });

    if (serverNotify.statusCode === 200) {
      return {
        status: 200,
        message: `Document with id = ${id} is updated`,
      };
    } else {
      // HERE IS CASE API QUERY iS NOT RESOLVED
      // TODO: ROLLBACK HERE
      logger.error(`[DOCUMENT]: ${serverNotify.error}`);

      return {
        status: serverNotify.statusCode,
        message: serverNotify.error,
      };
    }
  } catch (ex) {
    logger(ex.error || ex.message || 'Unexpected error');

    return ex.error ? ex : exception;
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

    const serverNotify = await rabbitSender('document.delete', { id });

    if (serverNotify.statusCode === 200) {
      return {
        status: 200,
        message: 'Deleted',
      };
    } else {
      // HERE IS CASE API QUERY iS NOT RESOLVED
      // TODO: ROLLBACK HERE
      logger.error(`[DOCUMENT]: ${serverNotify.error}`);

      return {
        status: serverNotify.statusCode,
        message: serverNotify.error,
      };
    }
  } catch (ex) {
    logger.error(ex.error || ex.message || 'Unexpect error when delete file');

    return ex.error ? ex : exception;
  }
}

async function purchaseDocument(docId, userId) {
  try {
    const filter = [
      {
        docId,
        userId,
      },
    ];
    const options = {
      searchType: 'EXACTLY',
    };
    const purchased = await docModel.getPurchased(filter, options);
    if (purchased && purchased.length) {
      return {
        status: 400,
        error: 'You have purchased this document',
      };
    }
    const doc = await docModel.getDocumentById(docId);
    if (!doc || !doc.length) {
      return {
        status: 400,
        error: 'Document not found',
      };
    }
    const userModel = new User();
    const user = await userModel.getById(userId);
    if (!user || !user.length) {
      return {
        status: 400,
        error: 'User not found',
      };
    }
    if (doc[0].price > user[0].money) {
      return {
        status: 400,
        error: 'Not enough money',
      };
    }
    const moneyAfterPurchase =  parseInt(user[0].money) - parseInt(doc[0].price);
    const res = await Promise.all([
      docModel.purchase({ docId, userId, money: doc[0].price, action: action.PURCHASE }),
      userModel.updateUser(userId, { money: moneyAfterPurchase }),
    ]);

    const serverNotify = await rabbitSender('purchase.create', {
      id: res[0].insertId,
      body: {
        docId,
        docName: doc[0].name,
        userId,
        userName: user[0].name,
        money: doc[0].price,
        action: action.PURCHASE,
      },
    });

    if (serverNotify.statusCode === 200) {
      return {
        status: 200,
        message: `Purchase document ${doc[0].name} success`,
      };
    } else {
      // HERE IS CASE API QUERY iS NOT RESOLVED
      // TODO: ROLLBACK HERE
      logger.error(`[PURCHASE]: ${serverNotify.error}`);

      return {
        status: serverNotify.statusCode,
        message: serverNotify.error,
      };
    }
  }
  catch (ex) {
    logger.error(ex.error || ex.message || `Unexpected error when purchase document ${docId}`);

    return ex.error ? ex : exception;
  }
}

async function downloadDocument(docId, userId) {
  try {
    const doc = await docModel.getDocumentById(docId);
    if (!doc || !doc.length) {
      return {
        status: 400,
        error: 'Document not found',
      };
    }
    const userModel = new User();
    const user = await userModel.getById(userId);
    if (!user || !user.length) {
      return {
        status: 400,
        error: 'User not found',
      };
    }
    const filter = [
      {
        docId,
        userId,
      },
    ];
    const options = {
      searchType: 'EXACTLY',
    };
    const purchased = await docModel.getPurchased(filter, options);

    if (!purchased || !purchased.length) {
      return {
        status: 400,
        error: `You have not purchased document ${doc[0].name} yet`,
      };
    }

    return {
      status: 200,
      path: doc[0].path,
    };
  } catch (ex) {
    logger(ex.error || ex.message || `Unexpected error when download file document ${docId}`);

    return ex.error ? ex : exception;
  }
}

async function approveDocument(docId, userId) {
  try {
    const doc = await docModel.getDocumentById(docId);
    if (!doc || !doc.length) {
      return {
        status: 400,
        error: 'Document not found',
      };
    }

    if(doc[0].approved === 1) {
      return {
        status: 400,
        error: 'Document has approved',
      };
    }
    const userModel = new User();
    const user = await userModel.getById(userId);
    if (!user || !user.length) {
      return {
        status: 400,
        error: 'User not found',
      };
    }
    const body = {
      approved: 1,
      approverId: userId,
    };

    const res = await Promise.all([
      docModel.updateDocumentById(docId, body),
      rabbitSender('document.update', {
        id: docId,
        body: Object.assign({ approverName: user[0].name }, body),
      }),
    ]);

    if (res[1].error) {
      return res[1];
    }

    return {
      status: 200,
      message: 'Approved success',
    };
  } catch (ex) {
    logger(ex.error || ex.message || `Unexpected error when approve file document ${docId}`);

    return ex.error ? ex : exception;
  }
}

export {
  uploadDocument,
  getListDocuments,
  getDocument,
  updateDocumentInfo,
  deleteDocument,
  purchaseDocument,
  downloadDocument,
  approveDocument,
};