import {
  CREATE_NEWS,
  CLEAR_MESSAGE,
  GET_NEWS,
} from './constants';

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CREATE_NEWS.REQUEST
 */
export function createNews(data, module) {
  return {
    type: CREATE_NEWS.REQUEST,
    data,
    module,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CREATE_NEWS.SUCCESS
 */
export function createNewsSuccess() {
  return {
    type: CREATE_NEWS.SUCCESS,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CREATE_NEWS.FAILURE
 */
export function createNewsFailure(error) {
  return {
    type: CREATE_NEWS.FAILURE,
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