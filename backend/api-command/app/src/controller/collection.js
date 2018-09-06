import Collection from '../model/collection';
import Category from '../model/category';
import User from '../model/user';
import Class from '../model/class';
import Subject from '../model/subject';
import logger from '../libs/logger';
import { dataValidator } from '../libs/ajv';
import { exception } from '../constant/error';
import rabbitSender from '../../rabbit/sender';

const collectionModel = new Collection;
const schemaId = 'http://dethithpt.com/collection-schema#';

async function getListCollections(args) {
  try {
    const { name, description, searchType, number, offset, sortBy, cols } = args;
    const filter = [];
    filter.push(name ? { name }: undefined);
    filter.push(description ? { description }: undefined);
    const options = { number, offset, sortBy, searchType, cols };
    const docs = await collectionModel.getListCollection(filter, options);

    return docs || [];
  } catch (ex) {
    logger.error(ex.message || 'Unexpected error when get collections');

    return exception;
  }

}

async function createCollection(body) {
  try {
    const resValidate = dataValidator(body, schemaId);
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
    const queryBody = Object.assign({}, body);
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

      queryBody.cates = newCate;
    }

    if (subjectIds && subjectIds.length) {
      const subModel = new Subject();
      const promises = Array.isArray(subjectIds) ?
        subjectIds.map(subjectId => subModel.getSubjectById(subjectId)) :
        subjectIds.split(',').map(subjectId => subModel.getSubjectById(subjectId));

      const subjects = await Promise.all(promises);
      // Will replace cates by an array with more than infomation
      newCate = subjects.map((sub, i) => {
        if (!sub || !sub.length) {
          throw {
            status: 400,
            error: `Subject id ${subjectIds.split(',')[i]} does not exists`,
          };
        }

        return {
          subId: sub[0].id,
          subName: sub[0].name,
        };
      });

      queryBody.subjects = newCate;
    }

    if (classIds && classIds.length) {
      const classModel = new Class();
      const promises = Array.isArray(classIds) ?
        classIds.map(classId => classModel.getClassById(classId)) :
        classIds.split(',').map(classId => classModel.getClassById(classId));

      const classes = await Promise.all(promises);
      // Will replace cates by an array with more than infomation
      newCate = classes.map((classes, i) => {
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

      queryBody.subjects = newCate;
    }

    body.cateIds = Array.isArray(cateIds) ? cateIds.join(',') : cateIds;
    const res = await collectionModel.addNewCollection(body);
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
    logger.error(ex.message || 'Unexpected error when create collection');

    return exception;
  }
}

async function getCollectionById(id, cols) {
  try {
    const result = await collectionModel.getCollectionById(id,  cols);

    return {
      status: 200,
      data: result,
    };
  } catch (ex) {
    logger.error(ex.message || 'Unexpected error when get collection');

    return exception;
  }

}

async function updateCollection(id, body) {
  try {
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
    const queryBody = Object.assign({}, body);
    let newCate;
    if (cateIds && cateIds.length) {
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
    logger(ex.message || 'Unexpected error when update collection');

    return exception;
  }
}

async function deleteCollectionById(id) {
  try {
    const result = await collectionModel.getCollectionById(id);

    if (!result || !result.length) {
      return {
        error: 'Collection not found',
        status: 404,
      };
    }

    await collectionModel.deleteCollectionById(id);
    const serverNotify = await rabbitSender('collection.delete', { id });
    if (serverNotify.statusCode === 200) {
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
    logger.error(ex.message || 'Unexpect error when delete collection');

    return exception;
  }
}

export {
  createCollection,
  getCollectionById,
  getListCollections,
  updateCollection,
  deleteCollectionById,
};