import {
  GET_CATEGORIES_REQUEST,
  GET_CATEGORIES_SUCCESS,
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
