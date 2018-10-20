import {
  GET_NEWS,
  DELETE_NEWS,
  CLEAR_PROCESS_STATUS,
  UPDATE_NEWS,
} from './constants';

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_NEWS.REQUEST
 */
export function getNews(query) {
  return {
    type: GET_NEWS.REQUEST,
    query,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_NEWS.SUCCESS
 */
export function getNewsSuccess(news) {
  return {
    type: GET_NEWS.SUCCESS,
    news,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of DELETE_NEWS.REQUEST
 */
export function deleteNews(ids) {
  return {
    type: DELETE_NEWS.REQUEST,
    ids,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of DELETE_NEWS.SUCCESS
 */
export function deleteNewsSuccess() {
  return {
    type: DELETE_NEWS.SUCCESS,
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
    all,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of UPDATE_NEWS.REQUEST
 */
export function updateNews(data, module) {
  return {
    type: UPDATE_NEWS.REQUEST,
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