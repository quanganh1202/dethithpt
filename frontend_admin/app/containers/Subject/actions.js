import {
  GET_SUBJECTS,
  DELETE_SUBJECTS,
  CLEAR_PROCESS_STATUS,
} from './constants';

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_SUBJECTS.REQUEST
 */
export function getSubjects() {
  return {
    type: GET_SUBJECTS.REQUEST,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_CLASSES.SUCCESS
 */
export function getSubjectsSuccess(subjects) {
  return {
    type: GET_SUBJECTS.SUCCESS,
    subjects,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of DELETE_SUBJECTS.REQUEST
 */
export function deleteSubjects(ids) {
  return {
    type: DELETE_SUBJECTS.REQUEST,
    ids,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of DELETE_SUBJECTS.SUCCESS
 */
export function deleteSubjectsSuccess() {
  return {
    type: DELETE_SUBJECTS.SUCCESS,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CLEAR_PROCESS_STATUS
 */
export function clearProcessStatus() {
  return {
    type: CLEAR_PROCESS_STATUS,
  };
}