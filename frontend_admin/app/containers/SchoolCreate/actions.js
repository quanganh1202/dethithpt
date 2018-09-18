import {
  CREATE_SUBJECT,
  CLEAR_MESSAGE,
} from './constants';

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CREATE_SUBJECT.REQUEST
 */
export function createSubject(data) {
  return {
    type: CREATE_SUBJECT.REQUEST,
    data,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CREATE_SUBJECT.SUCCESS
 */
export function createSubjectSuccess() {
  return {
    type: CREATE_SUBJECT.SUCCESS,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CREATE_SUBJECT.FAILURE
 */
export function createSubjectFailure(error) {
  return {
    type: CREATE_SUBJECT.FAILURE,
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
