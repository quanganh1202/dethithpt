import Class from '../model/class';
import User from '../model/user';
import logger from '../libs/logger';
import { dataValidator } from '../libs/ajv';
import { exception } from '../constant/error';
import rabbitSender from '../../rabbit/sender';

const classModel = new Class;
const schemaId = 'http://dethithpt.com/class-schema#';

async function getListClasses(args) {
  try {
    const { name, description, searchType, number, offset, sortBy, cols } = args;
    const filter = [];
    filter.push(name ? { name }: undefined);
    filter.push(description ? { description }: undefined);
    const options = { number, offset, sortBy, searchType, cols };
    const docs = await classModel.getListClass(filter, options);

    return docs || [];
  } catch (ex) {
    logger.error(ex.message || 'Unexpected error when get classes');

    return exception;
  }

}

async function createClass(body) {
  try {
    const resValidate = dataValidator(body, schemaId);
    if (!resValidate.valid) {
      return {
        status: 403,
        error: resValidate.errors,
      };
    }
    const { name, userId } = body;
    const userModel = new User();
    const user = await userModel.getById(userId);
    if (!user || !user.length || !user[0].status) {
      return {
        status: 400,
        error: 'User id does not exists',
      };
    }
    const cate = await classModel.getListClass([{ name }]);
    if (cate && cate.length) {
      return {
        error: `Class ${body.name} already existed`,
        status: 400,
      };
    }
    const queryBody = Object.assign({}, body);
    queryBody.userName = user[0].name;
    queryBody.userEmail = user[0].email;
    const res = await classModel.addNewClass(body);
    const serverNotify = await rabbitSender('class.create', { id: res.insertId, body: queryBody });
    if (serverNotify.statusCode === 200) {
      return {
        status: 201,
        message: `Class created with insertId = ${res.insertId}`,
      };
    } else {
      // HERE IS CASE API QUERY iS NOT RESOLVED
      // TODO: ROLLBACK HERE
      logger.error(`[CLASS]: ${serverNotify.error}`);

      return {
        status: serverNotify.statusCode,
        message: serverNotify.error,
      };
    }
  } catch (ex) {
    logger.error(ex.message || 'Unexpected error when create class');

    return exception;
  }
}

async function getClassById(id, cols) {
  try {
    const result = await classModel.getClassById(id,  cols);

    return {
      status: 200,
      data: result,
    };
  } catch (ex) {
    logger.error(ex.message || 'Unexpected error when get class');

    return exception;
  }

}

async function updateClass(id, body) {
  try {
    const existed = await classModel.getClassById(id);

    if (!existed || !existed.length) {
      return {
        status: 400,
        error: 'Class not found',
      };
    }

    const { name, userId } = body;

    if (name) {
      const classes = await classModel.getListClass([{ name }]);
      if (classes && classes.length && name !== existed[0].name) {
        return {
          error: `Class ${body.name} already existed`,
          status: 400,
        };
      }
    }

    const userModel = new User();
    const user = await userModel.getById(userId);
    if (!user || !user.length || !user[0].status) {
      return {
        status: 400,
        error: 'User id does not exists',
      };
    }
    if (existed[0].userId !== userId && user[0].role !== 'admin') {
      return {
        status: 403,
        error: 'Forbidden',
      };
    }
    delete body.userId;
    await classModel.updateClassById(id, body);
    const serverNotify = await rabbitSender('class.update', { id, body });
    if (serverNotify.statusCode === 200) {
      return {
        status: 200,
        message: `Class with id = ${id} is updated`,
      };
    } else {
      // HERE IS CASE API QUERY iS NOT RESOLVED
      // TODO: ROLLBACK HERE
      logger.error(`[CLASS]: ${serverNotify.error}`);

      return {
        status: serverNotify.statusCode,
        message: serverNotify.error,
      };
    }
  } catch (ex) {
    logger(ex.message || 'Unexpected error when update class');

    return exception;
  }
}

async function deleteClassById(id, userId) {
  try {
    const result = await classModel.getClassById(id);

    if (!result || !result.length) {
      return {
        error: 'Class not found',
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
    if (result[0].userId !== userId && user[0].role !== 'admin') {
      return {
        status: 403,
        error: 'Forbidden',
      };
    }

    await classModel.deleteClassById(id);
    const serverNotify = await rabbitSender('class.delete', { id });
    if (serverNotify.statusCode === 200) {
      return {
        status: 200,
        message: 'Deleted',
      };
    } else {
      // HERE IS CASE API QUERY iS NOT RESOLVED
      // TODO: ROLLBACK HERE
      logger.error(`[CLASS]: ${serverNotify.error}`);

      return {
        status: serverNotify.statusCode,
        message: serverNotify.error,
      };
    }
  } catch (ex) {
    logger.error(ex.message || 'Unexpect error when delete class');

    return exception;
  }
}

export {
  createClass,
  getClassById,
  getListClasses,
  updateClass,
  deleteClassById,
};