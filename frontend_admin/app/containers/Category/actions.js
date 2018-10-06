import {
  GET_CATEGORIES_REQUEST,
  GET_CATEGORIES_SUCCESS,
  DELETE_CATES,
  CLEAR_PROCESS_STATUS,
} from './constants';

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_CATEGORIES_REQUEST
 */
export function getCategories() {
  return {
    type: GET_CATEGORIES_REQUEST,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_CATEGORIES_SUCCESS
 */
export function getCategoriesSuccess(categories) {
  return {
    type: GET_CATEGORIES_SUCCESS,
    categories,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of DELETE_CATES.REQUEST
 */
export function deleteCates(ids) {
  return {
    type: DELETE_CATES.REQUEST,
    ids,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of DELETE_CATES.SUCCESS
 */
export function deleteCatesSuccess() {
  return {
    type: DELETE_CATES.SUCCESS,
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