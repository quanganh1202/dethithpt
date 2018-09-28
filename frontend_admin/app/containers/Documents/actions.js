import {
  GET_DOCS,
  APPROVE_DOCS
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
export function approveDocsSuccess({ data, total }) {
  return {
    type: APPROVE_DOCS.SUCCESS,
  };
}
