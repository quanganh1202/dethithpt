import Collection from '../model/collection';
import Category from '../model/category';
import User from '../model/user';
import Class from '../model/class';
import Subject from '../model/subject';
import logger from '../libs/logger';
import { dataValidator } from '../libs/ajv';
import { exception } from '../constant/error';
import rabbitSender from '../../rabbit/sender';
import * as roles from '../constant/roles';
import { isUndefined } from 'util';

const collectionModel = new Collection;
const createSchema = 'http://dethithpt.com/collection-create-schema#';
const updateSchema = 'http://dethithpt.com/collection-update-schema#';

async function createCollection(body) {
  try {
    const resValidate = dataValidator(body, createSchema);
    if (!resValidate.valid) {
      return {
        status: 403,
        error: resValidate.errors,
      };
    }
    const { name, cateIds, userId, subjectIds, classIds } = body;
    const collection = await collectionModel.getListCollection([{ 'name': name }]);
    if (collection && collection.length) {
      return {
        error: `Collection ${body.name} already existed`,
        status: 400,
      };
    }
    const userModel = new User();
    const user = await userModel.getById(userId);
    if (!user || !user.length || !user[0].status) {
      return {
        status: 400,
        error: 'User id does not exists',
      };
    }
    if (!isUndefined(body.priority)) {
      body.priority = user[0].role === roles.ADMIN ? body.priority : 0;
    }
    const queryBody = Object.assign({}, body);
    if (cateIds && cateIds.length) {
      const cateModel = new Category();
      const promises = Array.isArray(cateIds) ?
        cateIds.map(cateId => cateModel.getCategoryById(cateId)) :
        cateIds.split(',').map(cateId => cateModel.getCategoryById(cateId));

      const categories = await Promise.all(promises);
      // Will replace cates by an array with more than infomation
      const newCate = categories.map((cate, i) => {
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

      queryBody.cates = newCate;
    }

    if (subjectIds && subjectIds.length) {
      const subModel = new Subject();
      const promises = Array.isArray(subjectIds) ?
        subjectIds.map(subjectId => subModel.getSubjectById(subjectId)) :
        subjectIds.split(',').map(subjectId => subModel.getSubjectById(subjectId));

      const subjects = await Promise.all(promises);
      // Will replace cates by an array with more than infomation
      const newSubject = subjects.map((sub, i) => {
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

      queryBody.subjects = newSubject;
    }

    if (classIds && classIds.length) {
      const classModel = new Class();
      const promises = Array.isArray(classIds) ?
        classIds.map(classId => classModel.getClassById(classId)) :
        classIds.split(',').map(classId => classModel.getClassById(classId));

      const classes = await Promise.all(promises);
      // Will replace cates by an array with more than infomation
      const newClass = classes.map((classes, i) => {
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

      queryBody.classes = newClass;
    }

    body.cateIds = Array.isArray(cateIds) ? cateIds.join(',') : cateIds;
    const res = await collectionModel.addNewCollection(body);
    delete queryBody.cateIds;
    delete queryBody.classIds;
    delete queryBody.subjectIds;
    queryBody.userName = user[0].name;
    queryBody.userEmail = user[0].email;
    const serverNotify = await rabbitSender('collection.create', { id: res.insertId, body: queryBody });
    if (serverNotify.statusCode === 200) {
      return {
        status: 201,
        message: `Collection created with insertId = ${res.insertId}`,
      };
    } else {
      // HERE IS CASE API QUERY iS NOT RESOLVED
      // TODO: ROLLBACK HERE
      logger.error(`[COLLECTION]: ${serverNotify.error}`);

      return {
        status: serverNotify.statusCode,
        message: serverNotify.error,
      };
    }
  } catch (ex) {
    logger.error(ex.error || ex.message || 'Unexpected error when create collection');

    return ex.error ? ex : exception;
  }
}

async function updateCollection(id, body) {
  try {
    const resValidate = dataValidator(body, updateSchema);
    if (!resValidate.valid) {
      return {
        status: 403,
        error: resValidate.errors,
      };
    }
    const existed = await collectionModel.getCollectionById(id);

    if (!existed || !existed.length) {
      return {
        status: 400,
        error: 'Collection not found',
      };
    }

    const { name, userId, cateIds, classIds, subjectIds } = body;
    const collection = await collectionModel.getListCollection([{ name }]);
    if (collection && collection.length && name !== existed[0].name) {
      return {
        error: `Collection ${body.name} already existed`,
        status: 400,
      };
    }

    const userModel = new User();
    const user = await userModel.getById(userId);
    if (!user || !user.length || !user[0].status) {
      return {
        status: 400,
        error: 'User id does not exists',
      };
    }

    if (existed[0].userId.toString() !== userId && user[0].role !== roles.ADMIN) {
      return {
        status: 403,
        error: 'Forbidden',
      };
    }
    if (!isUndefined(body.priority)) {
      if (user[0].role !== roles.ADMIN) {
        return {
          status: 403,
          error: 'Forbidden: Not allow update priority',
        };
      }
    }
    delete body.userId;
    const queryBody = Object.assign({}, body);
    let newCate;
    if (cateIds) {
      const cateModel = new Category();
      const promises = Array.isArray(cateIds) ?
        cateIds.map(cateId => cateModel.getCategoryById(cateId)) :
        cateIds.split(',').map(cateId => cateModel.getCategoryById(cateId));

      const categories = await Promise.all(promises);
      // Will replace cateIds by an array with more than infomation
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

      queryBody.cateIds = newCate;
    }

    if (subjectIds) {
      const subModel = new Subject();
      const subject = await subModel.getSubjectById(subjectIds);
      if (!subject || !subject.length) {
        return {
          status: 400,
          error: 'Subject id does not exists',
        };
      }

      queryBody.subjectName =subject[0].name;
    }

    if (classIds) {
      const classModel = new Class();
      const _class = await classModel.getClassById(classIds);
      if (!_class || !_class.length) {
        return {
          status: 400,
          error: 'Class id does not exists',
        };
      }

      queryBody.className = _class[0].name;
    }

    body.cateIds = Array.isArray(cateIds) ? cateIds.join(',') : cateIds;

    await collectionModel.updateCollectionById(id, body);
    const serverNotify = await rabbitSender('collection.update', { id, body: queryBody });
    if (serverNotify.statusCode === 200) {
      return {
        status: 200,
        message: `Collection with id = ${id} is updated`,
      };
    } else {
      // HERE IS CASE API QUERY iS NOT RESOLVED
      // TODO: ROLLBACK HERE
      logger.error(`[COLLECTION]: ${serverNotify.error}`);

      return {
        status: serverNotify.statusCode,
        message: serverNotify.error,
      };
    }
  } catch (ex) {
    logger(ex.error || ex.message || 'Unexpected error when update collection');

    return ex.error ? ex : exception;
  }
}

async function deleteCollectionById(id, userId) {
  try {
    const result = await collectionModel.getCollectionById(id);

    if (!result || !result.length) {
      return {
        error: 'Collection not found',
        status: 404,
      };
    }
    const userModel = new User();
    const user = await userModel.getById(userId);
    if (!user || !user.length || !user[0].status) {
      return {
        status: 400,
        error: 'User id does not exists',
      };
    }
    if (result[0].userId.toString() !== userId && user[0].role !== roles.ADMIN) {
      return {
        status: 403,
        error: 'Forbidden',
      };
    }
    await collectionModel.deleteCollectionById(id);
    const serverNotify = await rabbitSender('collection.delete', { id });
    if (!serverNotify.error) {
      return {
        status: 200,
        message: 'Deleted',
      };
    } else {
      // HERE IS CASE API QUERY iS NOT RESOLVED
      // TODO: ROLLBACK HERE
      logger.error(`[COLLECTION]: ${serverNotify.error}`);

      return {
        status: serverNotify.statusCode,
        message: serverNotify.error,
      };
    }
  } catch (ex) {
    logger.error(ex.error || ex.message || 'Unexpect error when delete collection');

    return ex.error ? ex : exception;
  }
}

export {
  createCollection,
  updateCollection,
  deleteCollectionById,
};