import {
  GET_COLLECTIONS,
  DELETE_COLLECTIONS,
  CLEAR_PROCESS_STATUS,
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

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of DELETE_COLLECTIONS.REQUEST
 */
export function deleteCollections(ids) {
  return {
    type: DELETE_COLLECTIONS.REQUEST,
    ids,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of DELETE_COLLECTIONS.SUCCESS
 */
export function deleteCollectionsSuccess() {
  return {
    type: DELETE_COLLECTIONS.SUCCESS,
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
