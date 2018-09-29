import Category from '../model/category';
import User from '../model/user';
import logger from '../libs/logger';
import { dataValidator } from '../libs/ajv';
import { exception } from '../constant/error';
import rabbitSender from '../../rabbit/sender';

const cateModel = new Category;
const schemaId = 'http://dethithpt.com/category-schema#';

async function getListCategories(args) {
  try {
    const { name, description, searchType, number, offset, sortBy, cols } = args;
    const filter = [];
    filter.push(name ? { name }: undefined);
    filter.push(description ? { description }: undefined);
    const options = { number, offset, sortBy, searchType, cols };
    const docs = await cateModel.getListCategory(filter, options);

    return docs || [];
  } catch (ex) {
    logger.error(ex.message || 'Unexpected error when get list categories');

    return exception;
  }
}

async function createCategory(body) {
  try {
    const resValidate = dataValidator(body, schemaId);
    if (!resValidate.valid) {
      return {
        status: 403,
        error: resValidate.errors,
      };
    }
    body.priority = body.priority || '0';
    const { name } = body;
    const cate = await cateModel.getListCategory([{ name }]);
    if (cate && cate.length) {
      return {
        error: `Category ${body.name} already existed`,
        status: 400,
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

async function getCategoryById(id, cols) {
  try {
    const result = await cateModel.getCategoryById(id, cols);

    return {
      status: 200,
      data: result,
    };
  } catch (ex) {
    logger.error(ex.message || 'Unexpected error when get category');

    return exception;
  }

}

async function updateCategory(id, body) {
  try {
    const existed = await cateModel.getCategoryById(id);

    if (!existed || !existed.length) {
      return {
        status: 400,
        error: 'Category not found',
      };
    }

    const { name } = body;
    const cate = await cateModel.getListCategory([{ name }]);
    if (cate && cate.length && name !== existed[0].name) {
      return {
        error: `Category ${body.name} already existed`,
        status: 400,
      };
    }

    await cateModel.updateCategoryById(id, body);
    const serverNotify = await rabbitSender('category.update', { id, body });
    if (serverNotify.statusCode === 200) {
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

async function deleteCategoryById(id) {
  try {
    const result = await cateModel.getCategoryById(id);

    if (!result || !result.length) {
      return {
        error: 'Category not found',
        status: 404,
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
  getCategoryById,
  getListCategories,
  updateCategory,
  deleteCategoryById,
};