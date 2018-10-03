import {
  GET_NEWS_DETAILS,
} from './constants';

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_NEWS_DETAILS.REQUEST
 */
export function getNewsDetails(id) {
  return {
    type: GET_NEWS_DETAILS.REQUEST,
    id,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_NEWS_DETAILS.SUCCESS
 */
export function getNewsDetailsSuccess(data) {
  return {
    type: GET_NEWS_DETAILS.SUCCESS,
    data,
  };
}
