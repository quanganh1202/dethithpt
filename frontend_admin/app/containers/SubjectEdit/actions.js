import {
  UPDATE_SUBJECT,
  CLEAR_MESSAGE,
  GET_SUBJECT_DETAIL,
  CLEAR_DATA,
} from './constants';

/**
 * View SUBJECT detail
 *
 * @param  {name} name The new text of the input field
 *
    type: GET_SUBJECT_DETAIL.REQUEST,
 * @return {object}    An action object with a type of GET_SUBJECT_DETAIL.REQUEST
 */
export function getSubjectDetail(id) {
  return {
    type: GET_SUBJECT_DETAIL.REQUEST,
    id,
  };
}

/**
 * Changes the input field of the form
 *
    type: GET_SUBJECT_DETAIL.SUCCESS,
 * @return {object}    An action object with a type of GET_SUBJECT_DETAIL.SUCCESS
 */
export function getSubjectDetailSuccess(data) {
  return {
    type: GET_SUBJECT_DETAIL.SUCCESS,
    data,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
    type: GET_SUBJECT_DETAIL.FAILURE,
 * @return {object}    An action object with a type of GET_SUBJECT_DETAIL.FAILURE
 */
export function getSubjectDetailFailure(error) {
  return {
    type: GET_SUBJECT_DETAIL.FAILURE,
    error,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
    type: UPDATE_SUBJECT.REQUEST,
 * @return {object}    An action object with a type of UPDATE_SUBJECT.REQUEST
 */
export function updateSubject(data, id) {
  return {
    type: UPDATE_SUBJECT.REQUEST,
    data,
    id,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
    type: UPDATE_SUBJECT.SUCCESS,
 * @return {object}    An action object with a type of CREATE_SUBJECT.SUCCESS
 */
export function updateSubjectSuccess() {
  return {
    type: UPDATE_SUBJECT.SUCCESS,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
    type: UPDATE_SUBJECT.REQUEST,
 * @return {object}    An action object with a type of UPDATE_SUBJECT.FAILURE
 */
export function updateSubjectFailure(error) {
  return {
    type: UPDATE_SUBJECT.FAILURE,
    error,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CLEAR_MESSAGE
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
