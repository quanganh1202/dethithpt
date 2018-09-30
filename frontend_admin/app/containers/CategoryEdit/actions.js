import {
  UPDATE_CATEGORY,
  CLEAR_MESSAGE,
  GET_CATEGORY_DETAIL,
  CLEAR_DATA,
} from './constants';

/**
 * View category detail
 *
 * @param  {name} name The new text of the input field
 *
    type: GET_CATEGORY_DETAIL.REQUEST,
 * @return {object}    An action object with a type of GET_CATEGORY_DETAIL.REQUEST
 */
export function getCategoryDetail(id) {
  return {
    type: GET_CATEGORY_DETAIL.REQUEST,
    id,
  };
}

/**
 * Changes the input field of the form
 *
    type: GET_CATEGORY_DETAIL.SUCCESS,
 * @return {object}    An action object with a type of GET_CATEGORY_DETAIL.SUCCESS
 */
export function getCategoryDetailSuccess(data) {
  return {
    type: GET_CATEGORY_DETAIL.SUCCESS,
    data,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
    type: GET_CATEGORY_DETAIL.FAILURE,
 * @return {object}    An action object with a type of GET_CATEGORY_DETAIL.FAILURE
 */
export function getCategoryDetailFailure(error) {
  return {
    type: GET_CATEGORY_DETAIL.FAILURE,
    error,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
    type: UPDATE_CATEGORY.REQUEST,
 * @return {object}    An action object with a type of UPDATE_CATEGORY.REQUEST
 */
export function updateCategory(data, id) {
  return {
    type: UPDATE_CATEGORY.REQUEST,
    data,
    id,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
    type: UPDATE_CATEGORY.SUCCESS,
 * @return {object}    An action object with a type of CREATE_CATEGORY.SUCCESS
 */
export function updateCategorySuccess() {
  return {
    type: UPDATE_CATEGORY.SUCCESS,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
    type: UPDATE_CATEGORY.REQUEST,
 * @return {object}    An action object with a type of UPDATE_CATEGORY.FAILURE
 */
export function updateCategoryFailure(error) {
  return {
    type: UPDATE_CATEGORY.FAILURE,
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
