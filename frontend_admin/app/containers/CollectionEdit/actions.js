import {
  UPDATE_COLLECTION,
  GET_INIT_DATA,
  CLEAR_MESSAGE,
  CLEAR_DATA,
  GET_COLLECTION_DETAIL,
} from './constants';

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of UPDATE_COLLECTION.REQUEST
 */
export function updateCollection(id, data) {
  return {
    type: UPDATE_COLLECTION.REQUEST,
    data,
    id,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of UPDATE_COLLECTION.SUCCESS
 */
export function updateCollectionSuccess() {
  return {
    type: UPDATE_COLLECTION.SUCCESS,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of UPDATE.FAILURE
 */
export function updateCollectionFailure(error) {
  return {
    type: UPDATE_COLLECTION.FAILURE,
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

export function clearData() {
  return {
    type: CLEAR_DATA,
  };
}

/**
 * View collection detail
 *
 * @param  {name} name The new text of the input field
 *
    type: GET_COLLECTION_DETAIL.REQUEST,
 * @return {object}    An action object with a type of GET_COLLECTION_DETAIL.REQUEST
 */
export function getCollectionDetail(id) {
  return {
    type: GET_COLLECTION_DETAIL.REQUEST,
    id,
  };
}

/**
 * Changes the input field of the form
 *
    type: GET_COLLECTION_DETAIL.SUCCESS,
 * @return {object}    An action object with a type of GET_COLLECTION_DETAIL.SUCCESS
 */
export function getCollectionDetailSuccess(data) {
  return {
    type: GET_COLLECTION_DETAIL.SUCCESS,
    data,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
    type: GET_COLLECTION_DETAIL.FAILURE,
 * @return {object}    An action object with a type of GET_COLLECTION_DETAIL.FAILURE
 */
export function getCollectionDetailFailure(error) {
  return {
    type: GET_COLLECTION_DETAIL.FAILURE,
    error,
  };
}
