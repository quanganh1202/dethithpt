import moment from 'moment';
import Role from '../model/role';
import User from '../model/user';
import logger from '../libs/logger';
import { dataValidator } from '../libs/ajv';
import { exception } from '../constant/error';
import rabbitSender from '../../rabbit/sender';

const roleModel = new Role;
const schemaId = 'http://dethithpt.com/role-schema#';

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
  case '4':
    return {
      status: 400,
      error: 'This user has been blocked download feature',
    };
  default:
    break;
  }

  return user;
};
async function createRole(body) {
  try {
    const resValidate = dataValidator(body, schemaId);
    if (!resValidate.valid) {
      return {
        status: 403,
        error: resValidate.errors,
      };
    }
    const { name, userId } = body;
    const user = await checkUserActivation(userId);
    if (user.error) return user;
    const role = await roleModel.getListRole([{ name }]);
    if (role && role.length) {
      return {
        error: `Role ${body.name} already existed`,
        status: 400,
      };
    }

    const res = await roleModel.addNewRole(body);
    const queryBody = Object.assign({}, body, {
      userName: user[0].name,
      userEmail: user[0].email,
    });
    const serverNotify = await rabbitSender('role.create', { id: res.insertId, body: queryBody });
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