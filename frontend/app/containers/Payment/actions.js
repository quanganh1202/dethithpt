import {
  GET_DOC_DETAILS_REQUEST,
  GET_DOC_DETAILS_SUCCESS,
  GET_DOC_LIST_REQUEST,
  GET_DOC_LIST_SUCCESS,
  REQUEST_DOWNLOAD,
  REMOVE_FILE_SAVE,
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

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of REQUEST_DOWNLOAD.REQUEST
 */
export function requestDownload(id) {
  return {
    type: REQUEST_DOWNLOAD.REQUEST,
    id,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of REQUEST_DOWNLOAD.SUCCESS
 */
export function requestDownloadSuccess(file) {
  return {
    type: REQUEST_DOWNLOAD.SUCCESS,
    file,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of REQUEST_DOWNLOAD.FAILURE
 */
export function requestDownloadFailure(message) {
  return {
    type: REQUEST_DOWNLOAD.FAILURE,
    message,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of REMOVE_FILE_SAVE
 */
export function removeFileSave() {
  return {
    type: REMOVE_FILE_SAVE,
  };
}