import {
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
export function getDocumentsList(collectionId, query, clear) {
  return {
    type: GET_DOC_LIST_REQUEST,
    query,
    clear,
    id: collectionId,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CHANGE_USERNAME
 */
export function getDocumentsListSuccess({ data: documents, total }, collectionDetail) {
  return {
    type: GET_DOC_LIST_SUCCESS,
    documents,
    total,
    collection: collectionDetail,
  };
}
