import {
  GET_SUBJECTS,
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
