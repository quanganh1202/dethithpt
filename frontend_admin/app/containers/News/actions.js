import {
  GET_NEWS,
} from './constants';

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_NEWS.REQUEST
 */
export function getNews() {
  return {
    type: GET_NEWS.REQUEST,
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
