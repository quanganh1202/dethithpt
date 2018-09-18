import Role from '../model/role';
import logger from '../libs/logger';
import { dataValidator } from '../libs/ajv';
import { exception } from '../constant/error';
import rabbitSender from '../../rabbit/sender';

const roleModel = new Role;
const schemaId = 'http://dethithpt.com/role-schema#';

async function createRole(body) {
  try {
    const resValidate = dataValidator(body, schemaId);
    if (!resValidate.valid) {
      return {
        status: 403,
        error: resValidate.errors,
      };
    }
    const { name } = body;
    const role = await roleModel.getListRole([{ name }]);
    if (role && role.length) {
      return {
        error: `Role ${body.name} already existed`,
        status: 400,
      };
    }

    const res = await roleModel.addNewRole(body);
    const serverNotify = await rabbitSender('role.create', { id: res.insertId, body });
    if (serverNotify.statusCode === 200) {
      return {
        status: 201,
        message: `Role created with insertId = ${res.insertId}`,
      };
    } else {
      // HERE IS CASE API QUERY iS NOT RESOLVED
      // TODO: ROLLBACK HERE
      logger.error(`[ROLE]: ${serverNotify.error}`);

      return {
        status: serverNotify.statusCode,
        message: serverNotify.error,
      };
    }
  } catch (ex) {
    logger.error(ex.message || 'Unexpected error when create role');

    return exception;
  }
}

async function updateRole(id, body) {
  try {
    const existed = await roleModel.getRoleById(id);

    if (!existed || !existed.length) {
      return {
        status: 400,
        error: 'Role not found',
      };
    }

    const { name } = body;
    const role = await roleModel.getListRole([{ name }]);
    if (role && role.length && name !== existed[0].name) {
      return {
        error: `Role ${body.name} already existed`,
        status: 400,
      };
    }

    await roleModel.updateRoleById(id, body);
    const serverNotify = await rabbitSender('role.update', { id, body });
    if (serverNotify.statusCode === 200) {
      return {
        status: 200,
        message: `Role with id = ${id} is updated`,
      };
    } else {
      // HERE IS CASE API QUERY iS NOT RESOLVED
      // TODO: ROLLBACK HERE
      logger.error(`[ROLE]: ${serverNotify.error}`);

      return {
        status: serverNotify.statusCode,
        message: serverNotify.error,
      };
    }
  } catch (ex) {
    logger(ex.message || 'Unexpected error when update role');

    return exception;
  }
}

async function deleteRoleById(id) {
  try {
    const result = await roleModel.getRoleById(id);

    if (!result || !result.length) {
      return {
        error: 'Role not found',
        status: 404,
      };
    }

    await roleModel.getRoleById(id);
    const serverNotify = await rabbitSender('role.delete', { id });
    if (serverNotify.statusCode === 200) {
      return {
        status: 200,
        message: 'Deleted',
      };
    } else {
      // HERE IS CASE API QUERY iS NOT RESOLVED
      // TODO: ROLLBACK HERE
      logger.error(`[ROLE]: ${serverNotify.error}`);

      return {
        status: serverNotify.statusCode,
        message: serverNotify.error,
      };
    }
  } catch (ex) {
    logger.error(ex.message || 'Unexpect error when delete role');

    return exception;
  }
}

export {
  createRole,
  updateRole,
  deleteRoleById,
};