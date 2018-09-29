import Subject from '../model/subject';
import User from '../model/user';
import logger from '../libs/logger';
import { dataValidator } from '../libs/ajv';
import { exception } from '../constant/error';
import rabbitSender from '../../rabbit/sender';

const subModel = new Subject;
const schemaId = 'http://dethithpt.com/subject-schema#';

async function getListSubjects(args) {
  try {
    const { name, description, searchType, number, offset, sortBy, cols } = args;
    const filter = [];
    filter.push(name ? { name }: undefined);
    filter.push(description ? { description }: undefined);
    const options = { number, offset, sortBy, searchType, cols };
    const docs = await subModel.getListSubject(filter, options);

    return docs || [];
  } catch (ex) {
    logger.error(ex.message || 'Unexpected error when get subjects');

    return exception;
  }

}

async function createSubject(body) {
  try {
    const resValidate = dataValidator(body, schemaId);
    if (!resValidate.valid) {
      return {
        status: 403,
        error: resValidate.errors,
      };
    }
    const userModel = new User();
    const user = await userModel.getById(body.userId);
    if (!user || !user.length) {
      return {
        error: `User ${body.userId} does not exist`,
        status: 400,
      };
    }
    const { name } = body;
    const cate = await subModel.getListSubject([{ name }]);
    if (cate && cate.length) {
      return {
        error: `Subject ${body.name} already existed`,
        status: 400,
      };
    }

    const res = await subModel.addNewSubject(body);
    const queryBody = Object.assign({}, body, {
      userName: user[0].name,
      userEmail: user[0].email,
    });
    const serverNotify = await rabbitSender('subject.create', { id: res.insertId, body: queryBody });
    if (serverNotify.statusCode === 200) {
      return {
        status: 201,
        message: `Subject created with insertId = ${res.insertId}`,
      };
    } else {
      // HERE IS CASE API QUERY iS NOT RESOLVED
      // TODO: ROLLBACK HERE
      logger.error(`[SUBJECT]: ${serverNotify.error}`);

      return {
        status: serverNotify.statusCode,
        message: serverNotify.error,
      };
    }
  } catch (ex) {
    logger.error(ex.message || 'Unexpected error when create subject');

    return exception;
  }
}

async function getSubjectById(id, cols) {
  try {
    const result = await subModel.getSubjectById(id,  cols);

    return {
      status: 200,
      data: result,
    };
  } catch (ex) {
    logger.error(ex.message || 'Unexpected error when get subject');

    return exception;
  }

}

async function updateSubject(id, body) {
  try {
    const existed = await subModel.getSubjectById(id);
    if (!existed || !existed.length) {
      return {
        status: 400,
        error: 'Subject not found',
      };
    }

    const { name, userId } = body;
    if (name) {
      const subjects = await subModel.getListSubject([{ name }]);
      if (subjects && subjects.length && name !== existed[0].name) {
        return {
          error: `Subject ${body.name} already existed`,
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

    if (existed[0].userId.toString() !== userId && user[0].role !== 'admin') {
      return {
        status: 403,
        error: 'Forbidden',
      };
    }
    delete body.userId;
    await subModel.updateSubjectById(id, body);
    const serverNotify = await rabbitSender('subject.update', { id, body });
    if (serverNotify.statusCode === 200) {
      return {
        status: 200,
        message: `Subject with id = ${id} is updated`,
      };
    } else {
      // HERE IS CASE API QUERY iS NOT RESOLVED
      // TODO: ROLLBACK HERE
      logger.error(`[SUBJECT]: ${serverNotify.error}`);

      return {
        status: serverNotify.statusCode,
        message: serverNotify.error,
      };
    }
  } catch (ex) {
    logger(ex.message || 'Unexpected error when update subject');

    return exception;
  }
}

async function deleteSubjectById(id, userId) {
  try {
    const result = await subModel.getSubjectById(id);

    if (!result || !result.length) {
      return {
        error: 'Subject not found',
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
    if (result[0].userId.toString() !== userId && user[0].role !== 'admin') {
      return {
        status: 403,
        error: 'Forbidden',
      };
    }
    await subModel.deleteSubjectById(id);
    const serverNotify = await rabbitSender('subject.delete', { id });
    if (!serverNotify.error) {
      return {
        status: 200,
        message: 'Deleted',
      };
    } else {
      // HERE IS CASE API QUERY iS NOT RESOLVED
      // TODO: ROLLBACK HERE
      logger.error(`[SUBJECT]: ${serverNotify.error}`);

      return {
        status: serverNotify.statusCode,
        message: serverNotify.error,
      };
    }
  } catch (ex) {
    logger.error(ex.message || 'Unexpect error when delete subject');

    return exception;
  }
}

export {
  createSubject,
  getSubjectById,
  getListSubjects,
  updateSubject,
  deleteSubjectById,
};