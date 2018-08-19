import {
  GET_DOC_DETAILS_REQUEST,
  GET_DOC_DETAILS_SUCCESS,
  GET_DOC_LIST_REQUEST,
  GET_DOC_LIST_SUCCESS,
} from './constants';

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CHANGE_USERNAME
 */
export function getDocumentDetails(id) {
  return {
    type: GET_DOC_DETAILS_REQUEST,
    id,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CHANGE_USERNAME
 */
export function getDocumentDetailsSuccess(data) {
  return {
    type: GET_DOC_DETAILS_SUCCESS,
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
export function getDocumentsList(query) {
  return {
    type: GET_DOC_LIST_REQUEST,
    query,
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
