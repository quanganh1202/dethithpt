import {
  CREATE_COLLECTION,
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
 * @return {object}    An action object with a type of CREATE_CATEGORY.SUCCESS
 */
export function clearMessage() {
  return {
    type: CLEAR_MESSAGE,
  };
}
