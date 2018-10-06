import {
  CREATE_COLLECTION,
  GET_INIT_DATA,
  CLEAR_MESSAGE,
} from './constants';

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CREATE_COLLECTION.REQUEST
 */
export function createCollection(data) {
  return {
    type: CREATE_COLLECTION.REQUEST,
    data,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CREATE_COLLECTION.SUCCESS
 */
export function createCollectionSuccess() {
  return {
    type: CREATE_COLLECTION.SUCCESS,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CREATE_COLLECTION.FAILURE
 */
export function createCollectionFailure(error) {
  return {
    type: CREATE_COLLECTION.FAILURE,
    error,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_INIT_DATA.REQUEST
 */
export function getInitData(data) {
  return {
    type: GET_INIT_DATA.REQUEST,
    data,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_INIT_DATA.SUCCESS
 */
export function getInitDataSuccess({ categories, subjects, classes }) {
  return {
    type: GET_INIT_DATA.SUCCESS,
    categories,
    subjects,
    classes,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_INIT_DATA.FAILURE
 */
export function getInitDataFailure(error) {
  return {
    type: GET_INIT_DATA.FAILURE,
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
