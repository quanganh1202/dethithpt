import {
  UPDATE_CLASS,
  CLEAR_MESSAGE,
  GET_CLASS_DETAIL,
  CLEAR_DATA,
} from './constants';

/**
 * View class detail
 *
 * @param  {name} name The new text of the input field
 *
    type: GET_CLASS_DETAIL.REQUEST,
 * @return {object}    An action object with a type of GET_CLASS_DETAIL.REQUEST
 */
export function getClassDetail(id) {
  return {
    type: GET_CLASS_DETAIL.REQUEST,
    id,
  };
}

/**
 * Changes the input field of the form
 *
    type: GET_CLASS_DETAIL.SUCCESS,
 * @return {object}    An action object with a type of GET_CLASS_DETAIL.SUCCESS
 */
export function getClassDetailSuccess(data) {
  return {
    type: GET_CLASS_DETAIL.SUCCESS,
    data,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
    type: GET_CLASS_DETAIL.FAILURE,
 * @return {object}    An action object with a type of GET_CLASS_DETAIL.FAILURE
 */
export function getClassDetailFailure(error) {
  return {
    type: GET_CLASS_DETAIL.FAILURE,
    error,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
    type: UPDATE_CLASS.REQUEST,
 * @return {object}    An action object with a type of UPDATE_CLASS.REQUEST
 */
export function updateClass(data, id) {
  return {
    type: UPDATE_CLASS.REQUEST,
    data,
    id,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
    type: UPDATE_CLASS.SUCCESS,
 * @return {object}    An action object with a type of CREATE_CLASS.SUCCESS
 */
export function updateClassSuccess() {
  return {
    type: UPDATE_CLASS.SUCCESS,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
    type: UPDATE_CLASS.REQUEST,
 * @return {object}    An action object with a type of UPDATE_CLASS.FAILURE
 */
export function updateClassFailure(error) {
  return {
    type: UPDATE_CLASS.FAILURE,
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
