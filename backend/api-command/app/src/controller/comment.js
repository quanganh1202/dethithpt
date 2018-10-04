import moment from 'moment';
import Comment from '../model/comment';
import Document from '../model/document';
import User from '../model/user';
import logger from '../libs/logger';
import { dataValidator } from '../libs/ajv';
import { exception } from '../constant/error';
import rabbitSender from '../../rabbit/sender';
import * as roles from '../constant/roles';

const commentModel = new Comment;
const createSchema = 'http://dethithpt.com/comment-create-schema#';

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
      error: 'Account has been blocked',
    };
  case '2':
    return {
      status: 400,
      error: 'You must be provide required infomation',
    };

  case '3':
    if (moment(user[0].blockTo) >= moment.now()) {
      return {
        status: 400,
        error: `Account has been blocked from ${
          moment(user[0].blockFrom).format('YYYY-MM-DDTHH:mm:ss.SSS')} to ${moment(user[0].blockTo).format('YYYY-MM-DDTHH:mm:ss.SSS')}`,
      };
    }
    break;
  default:
    break;
  }

  return user;
};

async function createComment(body) {
  try {
    const resValidate = dataValidator(body, createSchema);
    if (!resValidate.valid) {
      return {
        status: 403,
        error: resValidate.errors,
      };
    }
    const { userId, docId } = body;
    const user = await checkUserActivation(userId);
    if (user.error) return user;
    const document = new Document();
    const doc = await document.getDocumentById(docId);
    if (!doc || !doc.length) {
      return {
        status: 400,
        error: 'Document does not exists',
      };
    }
    body.createdAt = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
    const queryBody = Object.assign({
      userName: user[0].name,
      docName: doc[0].name,
    }, body);
    const res = await commentModel.addNewComment(body);
    const serverNotify = await rabbitSender('comment.create', { id: res.insertId, body: queryBody });
    if (serverNotify.statusCode === 200) {
      return {
        status: 201,
        message: `Comment created with insertId = ${res.insertId}`,
      };
    } else {
      // HERE IS CASE API QUERY iS NOT RESOLVED
      // TODO: ROLLBACK HERE
      logger.error(`[COMMENT]: ${serverNotify.error}`);

      return {
        status: serverNotify.statusCode,
        message: serverNotify.error,
      };
    }
  } catch (ex) {
    logger.error(ex.error || ex.message || 'Unexpected error when create comment');

    return ex.error ? ex : exception;
  }
}

async function updateComment(id, body) {
  try {
    const resValidate = dataValidator(body, createSchema);
    if (!resValidate.valid) {
      return {
        status: 403,
        error: resValidate.errors,
      };
    }
    const existed = await commentModel.getCommentById(id);

    if (!existed || !existed.length) {
      return {
        status: 400,
        error: 'Comment not found',
      };
    }

    const { userId, docId } = body;
    const user = await checkUserActivation(userId);
    if (user.error) return user;
    if (existed[0].userId.toString() !== userId && user[0].role !== roles.ADMIN) {
      return {
        status: 403,
        error: 'Forbidden',
      };
    }
    const document = new Document();
    const doc = document.getDocumentById(docId);
    if (!doc || !doc.length) {
      return {
        status: 400,
        error: 'Document does not exists',
      };
    }
    body.updatedAt = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
    const queryBody = Object.assign({
      userName: user[0].name,
      docName: doc[0].name,
    }, body);
    await commentModel.updateCommentById(id, body);
    const serverNotify = await rabbitSender('comment.update', { id, body: queryBody });
    if (serverNotify.statusCode === 200) {
      return {
        status: 200,
        message: `Comment with id = ${id} is updated`,
      };
    } else {
      // HERE IS CASE API QUERY iS NOT RESOLVED
      // TODO: ROLLBACK HERE
      logger.error(`[COMMENT]: ${serverNotify.error}`);

      return {
        status: serverNotify.statusCode,
        message: serverNotify.error,
      };
    }
  } catch (ex) {
    logger(ex.error || ex.message || 'Unexpected error when update comment');

    return ex.error ? ex : exception;
  }
}

async function deleteComment(id, userId) {
  try {
    const result = await commentModel.getCommentById(id);

    if (!result || !result.length) {
      return {
        error: 'Comment not found',
        status: 404,
      };
    }
    const user = await checkUserActivation(userId);
    if (user.error) return user;
    if (result[0].userId.toString() !== userId && user[0].role !== roles.ADMIN) {
      return {
        status: 403,
        error: 'Forbidden',
      };
    }
    await commentModel.deleteCommentById(id);
    const serverNotify = await rabbitSender('comment.delete', { id });
    if (!serverNotify.error) {
      return {
        status: 200,
        message: 'Deleted',
      };
    } else {
      // HERE IS CASE API QUERY iS NOT RESOLVED
      // TODO: ROLLBACK HERE
      logger.error(`[COMMENT]: ${serverNotify.error}`);

      return {
        status: serverNotify.statusCode,
        message: serverNotify.error,
      };
    }
  } catch (ex) {
    logger.error(ex.error || ex.message || 'Unexpect error when delete comment');

    return ex.error ? ex : exception;
  }
}

export {
  createComment,
  updateComment,
  deleteComment,
};