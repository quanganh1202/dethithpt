import {
  EDIT_DOC,
  GET_DOC_DETAIL,
  CLEAR_MESSAGE,
  CLEAR_DATA,
  GET_DATA_INIT,
} from './constants';

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_DOC_DETAIL.REQUEST
 */
export function getDocDetail(id) {
  return {
    type: GET_DOC_DETAIL.REQUEST,
    id,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_DOC_DETAIL.SUCCESS
 */
export function getDocDetailSuccess(data) {
  return {
    type: GET_DOC_DETAIL.SUCCESS,
    data,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of EDIT_DOC.REQUEST
 */
export function editDoc(data, id) {
  return {
    type: EDIT_DOC.REQUEST,
    data,
    id,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of EDIT_DOC.SUCCESS
 */
export function editDocSuccess() {
  return {
    type: EDIT_DOC.SUCCESS,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of EDIT_DOC.FAILURE
 */
export function editDocFailure(error) {
  return {
    type: EDIT_DOC.FAILURE,
    error,
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
 * @return {object}    An action object with a type of CLEAR_MESSAGE
 */
export function clearMessage() {
  return {
    type: CLEAR_MESSAGE,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CLEAR_DATA
 */
export function clearData() {
  return {
    type: CLEAR_DATA,
  };
}
