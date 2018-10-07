import {
  GET_FILTER_DATA_REQUEST,
  GET_FILTER_DATA_SUCCESS,
  GET_DOC_LIST_REQUEST,
  GET_DOC_LIST_SUCCESS,
} from './constants';

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_FILTER_DATA_REQUEST
 */
export function getFilterData() {
  return {
    type: GET_FILTER_DATA_REQUEST,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_FILTER_DATA_SUCCESS
 */
export function getFilterDataSuccess(data) {
  return {
    type: GET_FILTER_DATA_SUCCESS,
    data,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CHANGE_USERNAME
 */
export function getDocumentsList(query, clear) {
  return {
    type: GET_DOC_LIST_REQUEST,
    query,
    clear,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CHANGE_USERNAME
 */
export function getDocumentsListSuccess({ data: documents, total }) {
  return {
    type: GET_DOC_LIST_SUCCESS,
    documents,
    total,
  };
}
