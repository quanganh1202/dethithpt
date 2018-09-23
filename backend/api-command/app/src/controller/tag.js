import rabbitSender from '../../rabbit/sender';
import logger from '../libs/logger';

async function updateTag(id, body) {
  try {
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