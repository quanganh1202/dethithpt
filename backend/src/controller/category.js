import Category from '../model/category';
import logger from '../libs/logger';
import { dataValidator } from '../libs/ajv';

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
    return {
      error: ex.message || 'Unexpected error when get documents',
      status: 500,
    };
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
    const { name } = body;
    const cate = await cateModel.getListCategory([{ name }]);
    if (cate && cate.length) {
      return {
        error: `Category ${body.name} already existed`,
        status: 400,
      };
    }

    const res = await cateModel.addNewCategory(body);

    return {
      status: 201,
      message: `Category created with insertId = ${res.insertId}`,
    };
  } catch (ex) {
    logger.error(ex.message || 'Unexpected error when create category');

    return {
      status: ex.status || 500,
      error: 'Unexpected error',
    };
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

    return {
      status: 500,
      error: 'Unexpected error',
    };
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

    return {
      status: 200,
      message: `Category with id = ${id} is updated`,
    };
  } catch (ex) {
    logger(ex.message || 'Unexpected error when update category');

    return {
      status: ex.status || 500,
      error: 'Unexpected error',
    };
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

    return {
      status: 200,
      message: 'Deleted',
    };
  } catch (ex) {
    logger.error(ex.message || 'Unexpect error when delete file');

    return {
      status: 500,
      error: 'Unexpected error',
    };
  }
}

export {
  createCategory,
  getCategoryById,
  getListCategories,
  updateCategory,
  deleteCategoryById,
};