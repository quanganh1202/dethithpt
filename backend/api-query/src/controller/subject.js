import Subject from '../model/subject';
import logger from '../libs/logger';
import { dataValidator } from '../libs/ajv';
import { exception } from '../constant/error';

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
    const { name } = body;
    const cate = await subModel.getListSubject([{ name }]);
    if (cate && cate.length) {
      return {
        error: `Subject ${body.name} already existed`,
        status: 400,
      };
    }

    const res = await subModel.addNewSubject(body);

    return {
      status: 201,
      message: `Subject created with insertId = ${res.insertId}`,
    };
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

    const { name } = body;
    const cate = await subModel.getListSubject([{ name }]);
    if (cate && cate.length && name !== existed[0].name) {
      return {
        error: `Subject ${body.name} already existed`,
        status: 400,
      };
    }

    await subModel.updateSubjectById(id, body);

    return {
      status: 200,
      message: `Subject with id = ${id} is updated`,
    };
  } catch (ex) {
    logger(ex.message || 'Unexpected error when update subject');

    return exception;
  }
}

async function deleteSubjectById(id) {
  try {
    const result = await subModel.getSubjectById(id);

    if (!result || !result.length) {
      return {
        error: 'Subject not found',
        status: 404,
      };
    }

    await subModel.deleteSubjectById(id);

    return {
      status: 200,
      message: 'Deleted',
    };
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