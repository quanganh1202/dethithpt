import {
  UPDATE_NEWS,
  CLEAR_MESSAGE,
  GET_NEWS_DETAIL,
  CLEAR_DATA,
} from './constants';

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of UPDATE_NEWS.REQUEST
 */
export function updateNews(id, data, module) {
  return {
    type: UPDATE_NEWS.REQUEST,
    id,
    data,
    module,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of UPDATE_NEWS.SUCCESS
 */
export function updateNewsSuccess() {
  return {
    type: UPDATE_NEWS.SUCCESS,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of UPDATE_NEWS.FAILURE
 */
export function updateNewsFailure(error) {
  return {
    type: UPDATE_NEWS.FAILURE,
    error,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CLEAR_DATA
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

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_NEWS_DETAIL.REQUEST
 */
export function getNewsDetail(id) {
  return {
    type: GET_NEWS_DETAIL.REQUEST,
    id,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_NEWS_DETAIL.SUCCESS
 */
export function getNewsDetailSuccess(data) {
  return {
    type: GET_NEWS_DETAIL.SUCCESS,
    data,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_NEWS_DETAIL.FAILURE
 */
export function getNewsDetailFailure(error) {
  return {
    type: GET_NEWS_DETAIL.FAILURE,
    error,
  };
}
