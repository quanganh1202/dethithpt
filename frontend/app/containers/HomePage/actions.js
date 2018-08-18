import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  UPDATE_USER_INFO_REQUEST,
  UPDATE_USER_INFO_SUCCESS,
  GET_DOC_LIST_REQUEST,
  GET_DOC_LIST_SUCCESS,
} from './constants';

/**
 * Changes the input field of the form
 *
 * @param  {name} payload to request login user
 *
 * @return {object}    An action object with a type of LOGIN_REQUEST
 */
export function login(payload) {
  return {
    type: LOGIN_REQUEST,
    payload,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} payload get from backend after login
 *
 * @return {object}    An action object with a type of LOGIN_SUCCESS
 */
export function loginSuccess(payload) {
  return {
    type: LOGIN_SUCCESS,
    payload,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} err from login
 *
 * @return {object}    An action object with a type of LOGIN_FAILURE
 */
export function loginFailure(err) {
  return {
    type: LOGIN_FAILURE,
    err,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} payload to complete user information
 *
 * @return {object}    An action object with a type of UPDATE_USER_INFO_REQUEST
 */
export function updateUserInfo(payload) {
  return {
    type: UPDATE_USER_INFO_REQUEST,
    payload,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {payload} payload get from backend after update successfully
 *
 * @return {object}    An action object with a type of UPDATE_USER_INFO_SUCCESS
 */
export function updateUserInfoSuccess(payload) {
  return {
    type: UPDATE_USER_INFO_SUCCESS,
    payload,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CHANGE_USERNAME
 */
export function getDocumentsList(query) {
  return {
    type: GET_DOC_LIST_REQUEST,
    query,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CHANGE_USERNAME
 */
export function getDocumentsListSuccess(documents) {
  return {
    type: GET_DOC_LIST_SUCCESS,
    documents,
  };
}
