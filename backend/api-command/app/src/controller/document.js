import path from 'path';
import moment from 'moment';
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
import header from '../constant/typeHeader';
import * as roles from '../constant/roles';
import { bonus } from './user';
import { isUndefined } from 'util';

const checkUserActivation = async (userId) => {
  const userModel = new User();
  const user = await userModel.getById(userId);
  if (!user || !user.length) {
    return {
      status: 400,
      error: 'User id does not exists',
    };
  }

  switch (user[0].status) {
  case 0:
    return {
      status: 400,
      error: 'Account has been blocked',
    };
  case 2:
    return {
      status: 400,
      error: 'You must be provide required infomation',
    };

  case 3:
    if (moment(user[0].blockFrom) <= moment.now()) {
      return {
        status: 400,
        error: `Account has been blocked from ${moment(user[0].blockFrom).format('YYYY-MM-DDTHH:mm:ss.SSS')}`,
      };
    }
    break;
  default:
    break;
  }

  return user;
};
const docModel = new Document();
const createSchema = 'http://dethithpt.com/document-create-schema#';
const updateSchema = 'http://dethithpt.com/document-update-schema#';

async function uploadDocument(body, file) {
  return new Promise(async (resolve) => {
    try {
      if (!body.price) body.price = '0'; // Default price of document is 0
      body.approved = 0;
      const resValidate = dataValidator(body, createSchema);
      if (!resValidate.valid) {
        return resolve({
          status: 403,
          error: resValidate.errors,
        });
      }

      if (!file || !file.length) {
        return resolve({
          status: 400,
          error: 'Should be provided a file to upload',
        });
      }

      const { tags, cateIds, subjectIds, classIds, collectionIds, yearSchools, userId } = body;
      const user = await checkUserActivation(userId);
      if (user.error) return resolve(user);
      if (user[0].role === roles.ADMIN) {
        body.approved = 1;
        body.priority = body.priority ? body.priority : 0;
      } else {
        body.priority = 0;
      }
      const queryBody = Object.assign({}, body);
      queryBody.userRole = user[0].role;
      if (cateIds) {
        const cateModel = new Category();
        const promises = cateIds.split(',').map(cateId => cateModel.getCategoryById(cateId));

        const categories = await Promise.all(promises);
        // Will replace cates by an array with more than infomation
        queryBody.cates = categories.map((cate, i) => {
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
      }

      if (subjectIds) {
        const subModel = new Subject();
        const promises = subjectIds.split(',').map(subjectId => subModel.getSubjectById(subjectId));

        const subjects = await Promise.all(promises);
        // Will replace cates by an array with more than infomation
        queryBody.subjects = subjects.map((sub, i) => {
          if (!sub || !sub.length) {
            throw {
              status: 400,
              error: `Subject id ${subjectIds.split(',')[i]} does not exists`,
            };
          }

          return {
            subjectId: sub[0].id,
            subjectName: sub[0].name,
          };
        });
        delete queryBody.subjectIds;
      }

      if (classIds && classIds.length) {
        const classModel = new Class();
        const promises = classIds.split(',').map(classId => classModel.getClassById(classId));

        const classes = await Promise.all(promises);
        // Will replace cates by an array with more than infomation
        queryBody.classes = classes.map((classes, i) => {
          if (!classes || !classes.length) {
            throw {
              status: 400,
              error: `CLass id ${classIds.split(',')[i]} does not exists`,
            };
          }

          return {
            classId: classes[0].id,
            className: classes[0].name,
          };
        });
        delete queryBody.classIds;
      }

      if (collectionIds && collectionIds.length) {
        const collectionModel = new Collection();
        const promises = collectionIds.split(',').map(collectionId => collectionModel.getCollectionById(collectionId));

        const collections = await Promise.all(promises);
        queryBody.collections = collections.map((collection, i) => {
          if (!collection || !collection.length) {
            throw {
              status: 400,
              error: `CLass id ${collectionIds.split(',')[i]} does not exists`,
            };
          }

          return {
            collectionId: collection[0].id,
            collectionName: collection[0].name,
          };
        });
        delete queryBody.collectionIds;
      }

      if(yearSchools) queryBody.yearSchools = yearSchools.split(',');
      if(tags) body.tags = tags.split(',').map(tag => tag.trim()).join(',');
      const { error, status, fileName, filePreview } =  fileHelpers.validateExtension(file, body.userId);
      if (error) {
        return resolve({
          error,
          status,
        });
      }

      body.path = fileName;
      queryBody.path = fileName;
      queryBody.view = 1;
      await fileHelpers.storeFile(file, fileName);
      body.totalPages = body.totalPages || 0;
      queryBody.totalPages = body.totalPages || 0;
      const res = await docModel.addNewDocument(body);

      // Append data and send to query api
      queryBody.userName = user[0].name;
      queryBody.userEmail = user[0].email;
      if (body.tags) queryBody.tags = body.tags.split(',');

      rabbitSender('document.convert', { body: {
        filePreview,
        fileName,
        file,
      }, queryBody, id: res.insertId });

      // Resolve if everything is valid. Insert data and store run background
      return resolve({
        status: 201,
        message: 'Document created. But available after serveral minute',
      });
    } catch (ex) {
      logger.error(`[DOCUMENT][UPLOAD] ${JSON.stringify(ex)}`);

      return resolve({
        status: ex.status || ex.statusCode || 500,
        error: ex.error || ex || 'Unexpected error when upload file',
      });
    }
  });
}

async function updateDocumentById(id, body, file) {
  return new Promise(async (resolve) => {
    try {
      const resValidate = dataValidator(body, updateSchema);
      if (!resValidate.valid) {
        return resolve({
          status: 403,
          error: resValidate.errors,
        });
      }

      const doc = await docModel.getDocumentById(id);
      if (!doc || !doc.length) {
        return resolve({
          status: 400,
          error: `Document ${id} does not exist`,
        });
      }

      const { tags, cateIds, subjectIds, classIds, collectionIds, yearSchools, userId } = body;
      const user = await checkUserActivation(userId);
      if (user.error) return resolve(user);
      if (!isUndefined(body.priority)) {
        if (user[0].role !== roles.ADMIN) {
          return resolve({
            status: 403,
            error: 'Forbidden: Not allow update priority',
          });
        }
      }
      if (doc[0].userId.toString() !== userId && user[0].role !== roles.ADMIN) {
        return resolve({
          status: 403,
          error: 'Forbidden',
        });
      }
      if (user[0].role !== roles.ADMIN && body.approved) {
        return resolve({
          status: 403,
          error: 'Forbidden: Not allow update approved',
        });
      }
      const queryBody = Object.assign({}, body);
      if (cateIds) {
        const cateModel = new Category();
        const promises = cateIds.split(',').map(cateId => cateModel.getCategoryById(cateId));

        const categories = await Promise.all(promises);
        // Will replace cates by an array with more than infomation
        queryBody.cates = categories.map((cate, i) => {
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
      }

      if (subjectIds) {
        const subModel = new Subject();
        const promises = subjectIds.split(',').map(subjectId => subModel.getSubjectById(subjectId));

        const subjects = await Promise.all(promises);
        // Will replace cates by an array with more than infomation
        queryBody.subjects = subjects.map((sub, i) => {
          if (!sub || !sub.length) {
            throw {
              status: 400,
              error: `Subject id ${subjectIds.split(',')[i]} does not exists`,
            };
          }

          return {
            subjectId: sub[0].id,
            subjectName: sub[0].name,
          };
        });
        delete queryBody.subjectIds;
      }

      if (classIds && classIds.length) {
        const classModel = new Class();
        const promises = classIds.split(',').map(classId => classModel.getClassById(classId));

        const classes = await Promise.all(promises);
        // Will replace cates by an array with more than infomation
        queryBody.classes = classes.map((classes, i) => {
          if (!classes || !classes.length) {
            throw {
              status: 400,
              error: `CLass id ${classIds.split(',')[i]} does not exists`,
            };
          }

          return {
            classId: classes[0].id,
            className: classes[0].name,
          };
        });
        delete queryBody.classIds;
      }

      if (collectionIds && collectionIds.length) {
        const collectionModel = new Collection();
        const promises = collectionIds.split(',').map(collectionId => collectionModel.getCollectionById(collectionId));

        const collections = await Promise.all(promises);
        queryBody.collections = collections.map((collection, i) => {
          if (!collection || !collection.length) {
            throw {
              status: 400,
              error: `CLass id ${collectionIds.split(',')[i]} does not exists`,
            };
          }

          return {
            collectionId: collection[0].id,
            collectionName: collection[0].name,
          };
        });
        delete queryBody.collectionIds;
      }

      if (yearSchools) queryBody.yearSchools = yearSchools.split(',');
      if (tags) body.tags = tags.split(',').map(tag => tag.trim()).join(',');
      if (file.length) {
        const { error, status, fileName, filePreview } =  fileHelpers.validateExtension(file, body.userId);
        if (error) {
          return resolve({
            error,
            status,
          });
        }
        resolve({
          status: 201,
          message: `Document ${id} updated`,
        });
        body.path = fileName;
        queryBody.path = fileName;
        await fileHelpers.storeFile(file, fileName);
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
        body.totalPages = numPages ? numPages : body.totalPages || 0;
        queryBody.totalPages = numPages ? numPages : body.totalPages || 0;
        await fileHelpers.removeFile(doc[0].path);
      }
      delete body.userId;
      delete queryBody.userId;
      if (!Object.keys(body).length) {
        return resolve({
          status: 201,
          message: `Document ${id} updated`,
        });
      }
      await docModel.updateDocumentById(id, body);
      // Append data and send to query api
      queryBody.userName = user[0].name;
      if (body.tags) queryBody.tags = body.tags.split(',');
      const serverNotify = await rabbitSender('document.update', { body: queryBody, id });
      if (serverNotify.statusCode === 200) {
        // Keep for normal case
        return resolve({
          status: 201,
          message: `Document ${id} updated`,
        });
      } else {
        // HERE IS CASE API QUERY iS NOT RESOLVED
        // TODO: ROLLBACK HERE
        logger.error(`[DOCUMENT]: ${serverNotify.error}`);

        return resolve({
          status: serverNotify.statusCode,
          message: serverNotify.error,
        });
      }
    } catch (ex) {
      logger.error(`[DOCUMENT][UPDATE] ${JSON.stringify(ex)}`);

      return resolve({
        status: ex.status || ex.statusCode || 500,
        error: ex.error || 'Unexpected error when update file',
      });
    }
  });
}

async function deleteDocument(id, userId) {
  try {
    const result = await docModel.getDocumentById(id);

    if (!result || !result.length) {
      return {
        error: 'Document not found',
        status: 404,
      };
    }
    const user = await checkUserActivation(userId);
    if (user.error) return user;
    if (result[0].userId.toString() !== userId && user[0].role !== roles.ADMIN) {
      return {
        status: 403,
        error: 'Forbidden',
      };
    }
    const oldPath = result[0].path;
    await Promise.all([
      docModel.deleteDocumentById(id),
      fileHelpers.removeFile(oldPath),
    ]);

    const { statusCode, error } = await rabbitSender('document.delete', { id });

    if (!error) {
      return {
        status: 200,
        message: 'Deleted',
      };
    } else {
      // HERE IS CASE API QUERY iS NOT RESOLVED
      // TODO: ROLLBACK HERE
      logger.error(`[DOCUMENT]: ${error}`);

      return {
        status: statusCode,
        message: error,
      };
    }
  } catch (ex) {
    logger.error(`[DOCUMENT] ${JSON.stringify(ex)}`);

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
    if (user[0].status === 4) {
      const {
        collectionIds,
        subjectIds,
        cateIds,
      } = doc[0];
      const {
        blockDownloadCollections,
        blockDownloadSubjects,
        blockDownloadCategories,
      } = user[0];

      if (subjectIds && blockDownloadSubjects) {
        const subjectToArray = subjectIds.split(',');
        const blockToArray = blockDownloadSubjects.split(',');
        const arrBlock = blockToArray.filter(i => subjectToArray.includes(i));
        if (arrBlock.length) {
          return {
            status: 400,
            error: 'Account has been blocked download feature with this subject',
          };
        }
      }

      if (collectionIds && blockDownloadCollections) {
        const collectionToArray = collectionIds.split(',');
        const blockToArray = blockDownloadCollections.split(',');
        const arrBlock = blockToArray.filter(i => collectionToArray.includes(i));
        if (arrBlock.length) {
          return {
            status: 400,
            error: 'Account has been blocked download feature with this collection',
          };
        }
      }

      if (cateIds && blockDownloadCategories) {
        const cateToArray = cateIds.split(',');
        const blockToArray = blockDownloadCategories.split(',');
        const arrBlock = blockToArray.filter(i => cateToArray.includes(i));
        if (arrBlock.length) {
          return {
            status: 400,
            error: 'Account has been blocked download feature with this category',
          };
        }
      }
    }
    if (parseInt(doc[0].price) > parseInt(user[0].money)) {
      return {
        status: 400,
        error: 'Not enough money',
      };
    }
    const moneyAfterPurchase =  parseInt(user[0].money) - (parseInt(doc[0].price) || 0);
    const res = await Promise.all([
      docModel.purchase({
        docId,
        userId,
        money: parseInt(doc[0].price),
        action: action.PURCHASE,
        actorId: userId,
      }),
      userModel.updateUser(userId, { money: moneyAfterPurchase }),
    ]);
    // Bonus
    if (parseInt(userId) !== parseInt(doc[0].userId) && user[0].role !== roles.ADMIN) {
      bonus(userId, doc[0].userId, doc[0].price * 10 / 100, null, true).then(r => {
        logger.info(`[PURCHASE][BONUS] ${JSON.stringify(r)}`);
      }).catch(e => {
        logger.error(`[PURCHASE][BONUS] ${JSON.stringify(e)}`);
      });
    }

    const serverNotify = await rabbitSender('purchase.create', {
      id: res[0].insertId,
      body: {
        docId,
        docName: doc[0].name,
        userId,
        userName: user[0].name,
        money: parseInt(doc[0].price),
        action: action.PURCHASE,
        actorId: userId,
        actorName: user[0].name,
        actorRole: user[0].role,
        actorMail: user[0].email,
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
    logger.error(`[DOCUMENT][PURCHASE] ${JSON.stringify(ex)}`);

    return ex.error ? ex : exception;
  }
}

async function downloadDocument(docId, userId, download) {
  try {
    const userValid = await checkUserActivation(userId);
    if (userValid.error) return user;
    const doc = await docModel.getDocumentById(docId);
    if (!doc || !doc.length) {
      return {
        status: 400,
        error: 'Document not found',
      };
    }
    if (isUndefined(download)) {
      return {
        status: 200,
        message: 'File available to download',
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
    if (user[0].status === 4) {
      const {
        collectionIds,
        subjectIds,
        cateIds,
      } = doc[0];
      const {
        blockDownloadCollections,
        blockDownloadSubjects,
        blockDownloadCategories,
      } = user[0];

      if (subjectIds && blockDownloadSubjects) {
        const subjectToArray = subjectIds.split(',');
        const blockToArray = blockDownloadSubjects.split(',');
        const arrBlock = blockToArray.filter(i => subjectToArray.includes(i));
        if (arrBlock.length) {
          return {
            status: 400,
            error: 'Account has been blocked download feature with this subject',
          };
        }
      }

      if (collectionIds && blockDownloadCollections) {
        const collectionToArray = collectionIds.split(',');
        const blockToArray = blockDownloadCollections.split(',');
        const arrBlock = blockToArray.filter(i => collectionToArray.includes(i));
        if (arrBlock.length) {
          return {
            status: 400,
            error: 'Account has been blocked download feature with this collection',
          };
        }
      }

      if (cateIds && blockDownloadCategories) {
        const cateToArray = cateIds.split(',');
        const blockToArray = blockDownloadCategories.split(',');
        const arrBlock = blockToArray.filter(i => cateToArray.includes(i));
        if (arrBlock.length) {
          return {
            status: 400,
            error: 'Account has been blocked download feature with this category',
          };
        }
      }
    }
    if (user[0].role !== roles.ADMIN) {
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
    }
    const ext = path.extname(doc[0].path);
    const queryBody = {
      docName: doc[0].name,
      docId,
      userName: user[0].name,
      userId,
      userEmail: user[0].email,
    };
    const serverNotify = await rabbitSender('download.create', { body: queryBody });
    if (serverNotify.error) {
      return {
        status: serverNotify.statusCode || 500,
        error: `[Query] ${serverNotify.error}`,
      };
    }

    return {
      status: 200,
      path: doc[0].path,
      type: header[ext],
    };
  } catch (ex) {
    logger.error(`[DOCUMENT][DOWNLOAD] ${JSON.stringify(ex)}`);

    return ex.error ? ex : exception;
  }
}

async function approveDocument(docId, userId, approvedStatus) {
  try {
    const doc = await docModel.getDocumentById(docId);
    if (!doc || !doc.length) {
      return {
        status: 400,
        error: 'Document not found',
      };
    }

    if (!['0', '1'].includes(approvedStatus)) {
      return {
        status: 400,
        error: 'Invalid approve status. Enum [0, 1]',
      };
    }

    if(doc[0].approved === 1 && parseInt(approvedStatus) === 1) {
      return {
        status: 400,
        error: 'Document has approved',
      };
    }

    if(doc[0].approved === 0 && parseInt(approvedStatus) === 0) {
      return {
        status: 400,
        error: 'Document has unapproved',
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
    if (user[0].role !== roles.ADMIN) {
      return {
        status: 403,
        error: 'Forbidden',
      };
    }
    const body = {
      approved: parseInt(approvedStatus),
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
    logger.error(`[DOCUMENT][APPROVE] ${JSON.stringify(ex)}`);

    return ex.error ? ex : exception;
  }
}

export {
  uploadDocument,
  updateDocumentById,
  deleteDocument,
  purchaseDocument,
  downloadDocument,
  approveDocument,
};