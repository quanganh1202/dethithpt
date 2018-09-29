import {
  GET_DOCS,
  APPROVE_DOCS,
  DELETE_DOC,
  UPDATE_DOCS,
  CLEAR_DELETE_STATUS,
  GET_DATA_INIT,
} from './constants';

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_DOCS.REQUEST
 */
export function getDocs(query) {
  return {
    type: GET_DOCS.REQUEST,
    query,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_DOCS.SUCCESS
 */
export function getDocsSuccess({ data, total }) {
  return {
    type: GET_DOCS.SUCCESS,
    documents: data,
    total,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of APPROVE_DOCS.REQUEST
 */
export function approveDocs(id) {
  return {
    type: APPROVE_DOCS.REQUEST,
    id,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of APPROVE_DOCS.SUCCESS
 */
export function approveDocsSuccess() {
  return {
    type: APPROVE_DOCS.SUCCESS,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of APPROVE_DOCS.REQUEST
 */
export function deleteDoc(ids) {
  return {
    type: DELETE_DOC.REQUEST,
    ids,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of APPROVE_DOCS.SUCCESS
 */
export function deleteDocSuccess() {
  return {
    type: DELETE_DOC.SUCCESS,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of UPDATE_DOCS.REQUEST
 */
export function updateDocs(ids, data) {
  return {
    type: UPDATE_DOCS.REQUEST,
    ids,
    data,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of UPDATE_DOCS.SUCCESS
 */
export function updateDocsSuccess() {
  return {
    type: UPDATE_DOCS.SUCCESS,
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

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of APPROVE_DOCS.SUCCESS
 */
export function clearDeleteStatus() {
  return {
    type: CLEAR_DELETE_STATUS,
  };
}
