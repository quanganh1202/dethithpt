import moment from 'moment';
import { isUndefined } from 'util';
import Subject from '../model/subject';
import User from '../model/user';
import logger from '../libs/logger';
import { dataValidator } from '../libs/ajv';
import { exception } from '../constant/error';
import rabbitSender from '../../rabbit/sender';
import * as roles from '../constant/roles';

const subModel = new Subject;
const createSchema = 'http://dethithpt.com/subject-create-schema#';
const updateSchema = 'http://dethithpt.com/subject-update-schema#';

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
async function createSubject(body) {
  try {
    const resValidate = dataValidator(body, createSchema);
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
    if (!isUndefined(body.priority)) {
      body.priority = user[0].role === roles.ADMIN ? body.priority : 0;
    }
    if (!isUndefined(body.position)) {
      body.position = user[0].role === roles.ADMIN ? body.position : 0;
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

async function updateSubject(id, body) {
  try {
    const resValidate = dataValidator(body, updateSchema);
    if (!resValidate.valid) {
      return {
        status: 403,
        error: resValidate.errors,
      };
    }
    const existed = await subModel.getSubjectById(id);
    if (!existed || !existed.length) {
      return {
        status: 400,
        error: 'Subject not found',
      };
    }

    const { userId } = body;
    const user = await checkUserActivation(userId);
    if (user.error) return user;
    if (existed[0].userId.toString() !== userId && user[0].role !== roles.ADMIN) {
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
    const user = await checkUserActivation(userId);
    if (user.error) return user;
    if (result[0].userId.toString() !== userId && user[0].role !== roles.ADMIN) {
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
  updateSubject,
  deleteSubjectById,
};