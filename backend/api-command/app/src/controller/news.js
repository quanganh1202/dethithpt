import moment from 'moment';
import News from '../model/news';
import User from '../model/user';
import logger from '../libs/logger';
import { dataValidator } from '../libs/ajv';
import { exception } from '../constant/error';
import rabbitSender from '../../rabbit/sender';
import * as roles from '../constant/roles';

const newsModel = new News;
const createSchema = 'http://dethithpt.com/news-create-schema#';
const updateSchema = 'http://dethithpt.com/news-update-schema#';

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

async function createNews(body) {
  try {
    body.priority = body.priority ? body.priority : '0';
    const resValidate = dataValidator(body, createSchema);
    if (!resValidate.valid) {
      return {
        status: 403,
        error: resValidate.errors,
      };
    }
    const { name, userId } = body;
    const user = await checkUserActivation(userId);
    if (user.error) return user;
    const news = await newsModel.getList([{ name }]);
    if (news && news.length) {
      return {
        error: `News ${body.name} already existed`,
        status: 400,
      };
    }
    const queryBody = Object.assign({}, body);
    queryBody.userName = user[0].name;
    queryBody.userEmail = user[0].email;
    const res = await newsModel.addNewNews(body);
    const serverNotify = await rabbitSender('news.create', { id: res.insertId, body: queryBody });
    if (serverNotify.statusCode === 200) {
      return {
        status: 201,
        message: `News created with insertId = ${res.insertId}`,
      };
    } else {
      logger.error(`[NEWS]: ${serverNotify.error}`);

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

async function updateNews(id, body) {
  try {
    const resValidate = dataValidator(body, updateSchema);
    if (!resValidate.valid) {
      return {
        status: 403,
        error: resValidate.errors,
      };
    }
    const existed = await newsModel.getById(id);

    if (!existed || !existed.length) {
      return {
        status: 400,
        error: 'News not found',
      };
    }

    const { name, userId } = body;

    if (name) {
      const news = await newsModel.getById([{ name }]);
      if (news && news.length && name !== existed[0].name) {
        return {
          error: `News ${body.name} already existed`,
          status: 400,
        };
      }
    }

    const user = await checkUserActivation(userId);
    if (user.error) return user;
    if (existed[0].userId.toString() !== userId && user[0].role !== roles.ADMIN) {
      return {
        status: 403,
        error: 'Forbidden',
      };
    }
    delete body.userId;
    await newsModel.updateNews(id, body);
    const serverNotify = await rabbitSender('news.update', { id, body });
    if (serverNotify.statusCode === 200) {
      return {
        status: 200,
        message: `News with id = ${id} is updated`,
      };
    } else {
      // HERE IS CASE API QUERY iS NOT RESOLVED
      // TODO: ROLLBACK HERE
      logger.error(`[NEWS]: ${serverNotify.error}`);

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

async function deleteNewsById(id, userId) {
  try {
    const result = await newsModel.getById(id);

    if (!result || !result.length) {
      return {
        error: 'News not found',
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

    await newsModel.deleteNews(id);
    const serverNotify = await rabbitSender('news.delete', { id });
    if (!serverNotify.error) {
      return {
        status: 200,
        message: 'Deleted',
      };
    } else {
      logger.error(`[NEWS]: ${serverNotify.error}`);

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
  createNews,
  updateNews,
  deleteNewsById,
};