import {
  GET_COLLECTIONS
} from './constants';

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_COLLECTIONS.REQUEST
 */
export function getCollections() {
  return {
    type: GET_COLLECTIONS.REQUEST,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_COLLECTIONS.SUCCESS
 */
export function getCollectionsSuccess(collections) {
  return {
    type: GET_COLLECTIONS.SUCCESS,
    collections,
  };
}
