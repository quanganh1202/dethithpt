import { isUndefined } from 'util';
import rabbitSender from '../../rabbit/sender';
import User from '../model/user';
import logger from '../libs/logger';
import * as roles from '../constant/roles';

async function updateTag(id, body) {
  try {
    const userModel = new User();
    const user = await userModel.getById(body.userId);
    if (!user || !user.length) {
      return {
        error: `User ${body.userId} does not exist`,
        status: 400,
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
    const res = await rabbitSender('tag.update', { id, body });
    if (res.error) {
      return {
        status: res.statusCode,
        error: res.error,
      };
    }

    return {
      status: res.statusCode,
      message: res.message,
    };
  } catch (ex) {
    logger.error(ex.message || ex.error || 'Unexpected error when update tag');

    return {
      status: ex.status || ex.statusCode || 500,
      error: ex.error || 'Unexpected error when update tag',
    };
  }
}

export {
  updateTag,
};