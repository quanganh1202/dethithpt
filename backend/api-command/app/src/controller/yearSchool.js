import YearSchool from '../model/yearSchool';
import logger from '../libs/logger';
import { dataValidator } from '../libs/ajv';
import { exception } from '../constant/error';

const ySchoolModel = new YearSchool;
const schemaId = 'http://dethithpt.com/yearSchool-schema#';

async function getListYearSchools(args) {
  try {
    const { name, description, searchType, number, offset, sortBy, cols } = args;
    const filter = [];
    filter.push(name ? { name }: undefined);
    filter.push(description ? { description }: undefined);
    const options = { number, offset, sortBy, searchType, cols };
    const docs = await ySchoolModel.getListYearSchool(filter, options);

    return docs || [];
  } catch (ex) {
    logger.error(ex.message || 'Unexpected error when get yearSchools');

    return exception;
  }

}

async function createYearSchool(body) {
  try {
    const resValidate = dataValidator(body, schemaId);
    if (!resValidate.valid) {
      return {
        status: 403,
        error: resValidate.errors,
      };
    }
    const { name } = body;
    const cate = await ySchoolModel.getListYearSchool([{ name }]);
    if (cate && cate.length) {
      return {
        error: `YearSchool ${body.name} already existed`,
        status: 400,
      };
    }

    const res = await ySchoolModel.addNewYearSchool(body);

    return {
      status: 201,
      message: `YearSchool created with insertId = ${res.insertId}`,
    };
  } catch (ex) {
    logger.error(ex.message || 'Unexpected error when create YearSchool');

    return exception;
  }
}

async function getYearSchoolById(id, cols) {
  try {
    const result = await ySchoolModel.getYearSchoolById(id,  cols);

    return {
      status: 200,
      data: result,
    };
  } catch (ex) {
    logger.error(ex.message || 'Unexpected error when get YearSchool');

    return exception;
  }

}

async function updateYearSchool(id, body) {
  try {
    const existed = await ySchoolModel.getYearSchoolById(id);

    if (!existed || !existed.length) {
      return {
        status: 400,
        error: 'YearSchool not found',
      };
    }

    const { name } = body;
    const cate = await ySchoolModel.getListYearSchool([{ name }]);
    if (cate && cate.length && name !== existed[0].name) {
      return {
        error: `YearSchool ${body.name} already existed`,
        status: 400,
      };
    }

    await ySchoolModel.updateYearSchoolById(id, body);

    return {
      status: 200,
      message: `YearSchool with id = ${id} is updated`,
    };
  } catch (ex) {
    logger(ex.message || 'Unexpected error when update YearSchool');

    return exception;
  }
}

async function deleteYearSchoolById(id) {
  try {
    const result = await ySchoolModel.getYearSchoolById(id);

    if (!result || !result.length) {
      return {
        error: 'YearSchool not found',
        status: 404,
      };
    }

    await ySchoolModel.deleteYearSchoolById(id);

    return {
      status: 200,
      message: 'Deleted',
    };
  } catch (ex) {
    logger.error(ex.message || 'Unexpect error when delete YearSchool');

    return exception;
  }
}

export {
  createYearSchool,
  getYearSchoolById,
  getListYearSchools,
  updateYearSchool,
  deleteYearSchoolById,
};