import Collection from '../model/collection';
import logger from '../libs/logger';
import { dataValidator } from '../libs/ajv';
import { exception } from '../constant/error';

const subModel = new Collection;
const schemaId = 'http://dethithpt.com/collection-schema#';

async function getListCollections(args) {
  try {
    const { name, description, searchType, number, offset, sortBy, cols } = args;
    const filter = [];
    filter.push(name ? { name }: undefined);
    filter.push(description ? { description }: undefined);
    const options = { number, offset, sortBy, searchType, cols };
    const docs = await subModel.getListCollection(filter, options);

    return docs || [];
  } catch (ex) {
    logger.error(ex.message || 'Unexpected error when get collections');

    return exception;
  }

}

async function createCollection(body) {
  try {
    const resValidate = dataValidator(body, schemaId);
    if (!resValidate.valid) {
      return {
        status: 403,
        error: resValidate.errors,
      };
    }
    const { name } = body;
    const cate = await subModel.getListCollection([{ name }]);
    if (cate && cate.length) {
      return {
        error: `Collection ${body.name} already existed`,
        status: 400,
      };
    }

    const res = await subModel.addNewCollection(body);

    return {
      status: 201,
      message: `Collection created with insertId = ${res.insertId}`,
    };
  } catch (ex) {
    logger.error(ex.message || 'Unexpected error when create collection');

    return exception;
  }
}

async function getCollectionById(id, cols) {
  try {
    const result = await subModel.getCollectionById(id,  cols);

    return {
      status: 200,
      data: result,
    };
  } catch (ex) {
    logger.error(ex.message || 'Unexpected error when get collection');

    return exception;
  }

}

async function updateCollection(id, body) {
  try {
    const existed = await subModel.getCollectionById(id);

    if (!existed || !existed.length) {
      return {
        status: 400,
        error: 'Collection not found',
      };
    }

    const { name } = body;
    const cate = await subModel.getListCollection([{ name }]);
    if (cate && cate.length && name !== existed[0].name) {
      return {
        error: `Collection ${body.name} already existed`,
        status: 400,
      };
    }

    await subModel.updateCollectionById(id, body);

    return {
      status: 200,
      message: `Collection with id = ${id} is updated`,
    };
  } catch (ex) {
    logger(ex.message || 'Unexpected error when update collection');

    return exception;
  }
}

async function deleteCollectionById(id) {
  try {
    const result = await subModel.getCollectionById(id);

    if (!result || !result.length) {
      return {
        error: 'Collection not found',
        status: 404,
      };
    }

    await subModel.deleteCollectionById(id);

    return {
      status: 200,
      message: 'Deleted',
    };
  } catch (ex) {
    logger.error(ex.message || 'Unexpect error when delete collection');

    return exception;
  }
}

export {
  createCollection,
  getCollectionById,
  getListCollections,
  updateCollection,
  deleteCollectionById,
};