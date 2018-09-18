import {
  GET_SCHOOLS,
} from './constants';

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_SCHOOLS.REQUEST
 */
export function getSchools() {
  return {
    type: GET_SCHOOLS.REQUEST,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_SCHOOLS.SUCCESS
 */
export function getSchoolsSuccess(schools) {
  return {
    type: GET_SCHOOLS.SUCCESS,
    schools,
  };
}
