import {
  GET_USERS,
} from './constants';

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_USERS.REQUEST
 */
export function getUsers(query) {
  return {
    type: GET_USERS.REQUEST,
    query,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_USERS.SUCCESS
 */
export function getUsersSuccess({ data, total }) {
  return {
    type: GET_USERS.SUCCESS,
    users: data,
    total,
  };
}
