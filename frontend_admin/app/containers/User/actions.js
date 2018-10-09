import {
  GET_USERS,
  GET_DATA_INIT,
  GET_HISTORY,
  CLEAR_DATA,
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

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_DATA_INIT.REQUEST
 */
export function getDataInit() {
  return {
    type: GET_DATA_INIT.REQUEST,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_DATA_INIT.SUCCESS
 */
export function getDataInitSuccess(data) {
  return {
    type: GET_DATA_INIT.SUCCESS,
    data,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_HISTORY.REQUEST
 */
export function getHistory(id, type) {
  return {
    type: GET_HISTORY.REQUEST,
    id,
    historyType: type,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_HISTORY.SUCCESS
 */
export function getHistorySuccess(data) {
  return {
    type: GET_HISTORY.SUCCESS,
    data,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_HISTORY.SUCCESS
 */
export function clearData(all) {
  return {
    type: CLEAR_DATA,
    all,
  };
}
