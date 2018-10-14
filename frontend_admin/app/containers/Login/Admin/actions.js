import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  CLEAR_MESSAGE,
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
 * @param  {name} err from login
 *
 * @return {object}    An action object with a type of CLEAR_MESSAGE
 */
export function clearMessage() {
  return {
    type: CLEAR_MESSAGE,
  };
}
