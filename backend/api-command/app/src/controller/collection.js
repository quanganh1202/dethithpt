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
    const { name, cates, userId, subjectId, classId } = body;
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
    if (cates && cates.length) {
      const cateModel = new Category();
      const promises = Array.isArray(cates) ?
        cates.map(cateId => cateModel.getCategoryById(cateId)) :
        cates.split(',').map(cateId => cateModel.getCategoryById(cateId));

      const categories = await Promise.all(promises);
      // Will replace cates by an array with more than infomation
      newCate = categories.map((cate, i) => {
        if (!cate || !cate.length) {
          throw {
            status: 400,
            error: `Category id ${cates.split(',')[i]} does not exists`,
          };
        }

        return {
          cateId: cate[0].id,
          cateName: cate[0].name,
        };
      });

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

    body.cates = Array.isArray(cates) ? cates.join(',') : cates;
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

    const { name, userId, cates, classId, subjectId } = body;
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
    if (cates && cates.length) {
      const cateModel = new Category();
      const promises = Array.isArray(cates) ?
        cates.map(cateId => cateModel.getCategoryById(cateId)) :
        cates.split(',').map(cateId => cateModel.getCategoryById(cateId));

      const categories = await Promise.all(promises);
      // Will replace cates by an array with more than infomation
      newCate = categories.map((cate, i) => {
        if (!cate || !cate.length) {
          throw {
            status: 400,
            error: `Category id ${cates.split(',')[i]} does not exists`,
          };
        }

        return {
          cateId: cate[0].id,
          cateName: cate[0].name,
        };
      });

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

    body.cates = Array.isArray(cates) ? cates.join(',') : cates;

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