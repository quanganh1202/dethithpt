import Class from '../model/class';
import logger from '../libs/logger';
import { dataValidator } from '../libs/ajv';

const cateModel = new Class;
const schemaId = 'http://dethithpt.com/class-schema#';

async function getListClasses(args) {
  try {
    const { name, description, searchType, number, offset, sortBy } = args;
    const filter = [];
    filter.push(name ? { name }: undefined);
    filter.push(description ? { description }: undefined);
    const options = { number, offset, sortBy, searchType };
    const docs = await cateModel.getListClass(filter, options);

    return docs || [];
  } catch (ex) {
    return {
      error: ex.message || 'Unexpected error when get documents',
      status: 500,
    };
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
    const { name } = body;
    const cate = await cateModel.getListClass([{ name }]);
    if (cate && cate.length) {
      return {
        error: `Class ${body.name} already existed`,
        status: 400,
      };
    }

    const res = await cateModel.addNewClass(body);

    return {
      status: 201,
      message: `Class created with insertId = ${res.insertId}`,
    };
  } catch (ex) {
    logger.error(ex.message || 'Unexpected error when create Class');

    return {
      status: ex.status || 500,
      error: 'Unexpected error',
    };
  }
}

async function getClassById(id, cols) {
  try {
    const result = await cateModel.getClassById(id, cols);

    return {
      status: 200,
      data: result,
    };
  } catch (ex) {
    logger.error(ex.message || 'Unexpected error when get Class');

    return {
      status: 500,
      error: 'Unexpected error',
    };
  }

}

async function updateClass(id, body) {
  try {
    const existed = await cateModel.getClassById(id);

    if (!existed || !existed.length) {
      return {
        status: 400,
        error: 'Class not found',
      };
    }

    const { name } = body;
    const cate = await cateModel.getListClass([{ name }]);
    if (cate && cate.length && name !== existed[0].name) {
      return {
        error: `Class ${body.name} already existed`,
        status: 400,
      };
    }

    await cateModel.updateClassById(id, body);

    return {
      status: 200,
      message: `Class with id = ${id} is updated`,
    };
  } catch (ex) {
    logger(ex.message || 'Unexpected error when update Class');

    return {
      status: ex.status || 500,
      error: 'Unexpected error',
    };
  }
}

async function deleteClassById(id) {
  try {
    const result = await cateModel.getClassById(id);

    if (!result || !result.length) {
      return {
        error: 'Class not found',
        status: 404,
      };
    }

    await cateModel.deleteClassById(id);

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
  createClass,
  getClassById,
  getListClasses,
  updateClass,
  deleteClassById,
};