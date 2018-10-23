import {
  GET_COLLECTIONS,
  DELETE_COLLECTIONS,
  CLEAR_PROCESS_STATUS,
  UPDATE_COLLECTIONS,
  GET_DATA_INIT,
} from './constants';

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_COLLECTIONS.REQUEST
 */
export function getCollections(queries) {
  return {
    type: GET_COLLECTIONS.REQUEST,
    queries,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_COLLECTIONS.SUCCESS
 */
export function getCollectionsSuccess(collections, total) {
  return {
    type: GET_COLLECTIONS.SUCCESS,
    collections,
    total,
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
export function clearProcessStatus(all) {
  return {
    type: CLEAR_PROCESS_STATUS,
    all
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of UPDATE_COLLECTIONS.REQUEST
 */
export function updateCollections(collections) {
  return {
    type: UPDATE_COLLECTIONS.REQUEST,
    collections,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of UPDATE_COLLECTIONS.SUCCESS
 */
export function updateCollectionsSuccess() {
  return {
    type: UPDATE_COLLECTIONS.SUCCESS,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_DATA_INIT.REQUEST
 */
export function getDataInit() {
  return {
    type: GET_DATA_INIT.REQUEST,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_DATA_INIT.SUCCESS
 */
export function getDataInitSuccess(data) {
  return {
    type: GET_DATA_INIT.SUCCESS,
    data,
  };
}