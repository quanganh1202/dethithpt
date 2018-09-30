import moment from 'moment';
import Category from '../model/category';
import User from '../model/user';
import logger from '../libs/logger';
import { dataValidator } from '../libs/ajv';
import { exception } from '../constant/error';
import rabbitSender from '../../rabbit/sender';
import * as roles from '../constant/roles';
import { isUndefined } from 'util';

const cateModel = new Category;
const createSchema = 'http://dethithpt.com/category-create-schema#';
const updateSchema = 'http://dethithpt.com/category-update-schema#';

const checkUserActivation = async (userId) => {
  const userModel = new User();
  const user = await userModel.getById(userId);
  if (!user || !user.length) {
    return {
      status: 400,
      error: 'User id does not exists',
    };
  }

  switch (user[0].status.toString()) {
  case '0':
    return {
      status: 400,
      error: 'This user has been blocked',
    };
  case '2':
    return {
      status: 400,
      error: 'This user need to provide some infomation',
    };

  case '3':
    if (moment(user[0].blockTo) >= moment.now()) {
      return {
        status: 400,
        error: `This user has been blocked from ${
          moment(user[0].blockFrom).format('YYYY-MM-DDTHH:mm:ss.SSS')} to ${moment(user[0].blockTo).format('YYYY-MM-DDTHH:mm:ss.SSS')}`,
      };
    }
    break;
  default:
    break;
  }

  return user;
};

async function createCategory(body) {
  try {
    const resValidate = dataValidator(body, createSchema);
    if (!resValidate.valid) {
      return {
        status: 403,
        error: resValidate.errors,
      };
    }

    const { name, userId } = body;
    const cate = await cateModel.getListCategory([{ name }]);
    if (cate && cate.length) {
      return {
        error: `Category ${body.name} already existed`,
        status: 400,
      };
    }

    const user = await checkUserActivation(userId);
    if (user.error) return user;
    if (!isUndefined(body.priority)) {
      body.priority = user[0].role === 'admin' ? body.priority : 0;
    }
    const { insertId } = await cateModel.addNewCategory(body);
    const queryBody = Object.assign({}, body, {
      userName: user[0].name,
      userEmail: user[0].email,
    });

    const serverNotify = await rabbitSender('category.create', { body: queryBody, id: insertId });
    if (serverNotify.statusCode === 200) {
      return {
        status: 201,
        message: `Category created with insertId = ${insertId}`,
      };
    } else {
      // HERE IS CASE API QUERY iS NOT RESOLVED
      // TODO: ROLLBACK HERE
      logger.error(`[CATEGORY]: ${serverNotify.error}`);

      return {
        status: serverNotify.statusCode,
        message: serverNotify.error,
      };
    }
  } catch (ex) {
    logger.error(ex.message || 'Unexpected error when create category');

    return exception;
  }
}

async function updateCategory(id, body) {
  try {
    const resValidate = dataValidator(body, updateSchema);
    if (!resValidate.valid) {
      return {
        status: 403,
        error: resValidate.errors,
      };
    }

    const existed = await cateModel.getCategoryById(id);

    if (!existed || !existed.length) {
      return {
        status: 400,
        error: 'Category not found',
      };
    }

    const { name, userId } = body;
    if (name) {
      const cate = await cateModel.getListCategory([{ name }]);
      if (cate && cate.length && name !== existed[0].name) {
        return {
          error: `Category ${body.name} already existed`,
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
    if (!isUndefined(body.priority)) {
      if (user[0].role !== roles.ADMIN) {
        return {
          status: 403,
          error: 'Forbidden: Not allow update priority',
        };
      }
    }
    delete body.userId;
    await cateModel.updateCategoryById(id, body);
    const serverNotify = await rabbitSender('category.update', { id, body });
    if (!serverNotify.error) {
      return {
        status: 200,
        message: `Category with id = ${id} is updated`,
      };
    } else {
      // HERE IS CASE API QUERY iS NOT RESOLVED
      // TODO: ROLLBACK HERE
      logger.error(`[CATEGORY]: ${serverNotify.error}`);

      return {
        status: serverNotify.statusCode,
        message: serverNotify.error,
      };
    }
  } catch (ex) {
    logger(ex.message || 'Unexpected error when update category');

    return exception;
  }
}

async function deleteCategoryById(id, userId) {
  try {
    const result = await cateModel.getCategoryById(id);

    if (!result || !result.length) {
      return {
        error: 'Category not found',
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
    await cateModel.deleteCategoryById(id);
    const serverNotify = await rabbitSender('category.delete', { id });
    if (serverNotify.statusCode === 200) {
      return {
        status: 200,
        message: 'Deleted',
      };
    } else {
      // HERE IS CASE API QUERY iS NOT RESOLVED
      // TODO: ROLLBACK HERE
      logger.error(`[CATEGORY]: ${serverNotify.error}`);

      return {
        status: serverNotify.statusCode,
        message: serverNotify.error,
      };
    }
  } catch (ex) {
    logger.error(ex.message || 'Unexpect error when delete file');

    return exception;
  }
}

export {
  createCategory,
  updateCategory,
  deleteCategoryById,
};