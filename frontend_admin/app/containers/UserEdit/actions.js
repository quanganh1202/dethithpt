import {
  UPDATE_USER,
  CLEAR_MESSAGE,
  GET_USER_DETAIL,
  CLEAR_DATA,
  GET_DATA_INIT,
} from './constants';

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
 * View user detail
 *
 * @param  {name} name The new text of the input field
 *
    type: GET_USER_DETAIL.REQUEST,
 * @return {object}    An action object with a type of GET_USER_DETAIL.REQUEST
 */
export function getUserDetail(id) {
  return {
    type: GET_USER_DETAIL.REQUEST,
    id,
  };
}

/**
 * Changes the input field of the form
 *
    type: GET_USER_DETAIL.SUCCESS,
 * @return {object}    An action object with a type of GET_USER_DETAIL.SUCCESS
 */
export function getUserDetailSuccess(data) {
  return {
    type: GET_USER_DETAIL.SUCCESS,
    data,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
    type: GET_USER_DETAIL.FAILURE,
 * @return {object}    An action object with a type of GET_USER_DETAIL.FAILURE
 */
export function getUserDetailFailure(error) {
  return {
    type: GET_USER_DETAIL.FAILURE,
    error,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
    type: UPDATE_USER.REQUEST,
 * @return {object}    An action object with a type of UPDATE_USER.REQUEST
 */
export function updateUser(data, id) {
  return {
    type: UPDATE_USER.REQUEST,
    data,
    id,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
    type: UPDATE_USER.SUCCESS,
 * @return {object}    An action object with a type of CREATE_USER.SUCCESS
 */
export function updateUserSuccess() {
  return {
    type: UPDATE_USER.SUCCESS,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
    type: UPDATE_USER.REQUEST,
 * @return {object}    An action object with a type of UPDATE_USER.FAILURE
 */
export function updateUserFailure(error) {
  return {
    type: UPDATE_USER.FAILURE,
    error,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CREATE_CATEGORY.SUCCESS
 */
export function clearMessage() {
  return {
    type: CLEAR_MESSAGE,
  };
}

export function clearData() {
  return {
    type: CLEAR_DATA,
  };
}
