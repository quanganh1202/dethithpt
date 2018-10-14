import {
  GET_USER_DETAILS,
} from './constants';

/**
 * Changes the input field of the form
 *
 * @param  {name} payload to request login user
 *
 * @return {object}    An action object with a type of GET_USER_DETAILS.REQUEST
 */
export function getUserDetails(id) {
  return {
    type: GET_USER_DETAILS.REQUEST,
    id,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} payload get from backend after login
 *
 * @return {object}    An action object with a type of GET_USER_DETAILS.SUCCESS
 */
export function getUserDetailsSuccess({ user, history, upload, download }) {
  return {
    type: GET_USER_DETAILS.SUCCESS,
    user,
    history,
    upload,
    download,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} err from login
 *
 * @return {object}    An action object with a type of GET_USER_DETAILS.FAILURE
 */
export function getUserDetailsFailure(err) {
  return {
    type: GET_USER_DETAILS.FAILURE,
    err,
  };
}
