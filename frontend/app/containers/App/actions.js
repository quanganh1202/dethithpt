/*
 * App Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import { GET_USER_DETAILS, CLEAR_DATA } from './constants';

/**
 * Load the repositories, this action starts the request saga
 *
 * @return {object} An action object with a type of GET_USER_DETAILS.REQUEST
 */
export function getUserDetail(id, popout) {
  return {
    type: GET_USER_DETAILS.REQUEST,
    id,
    popout,
  };
}

/**
 * Dispatched when the repositories are loaded by the request saga
 *
 * @param  {array} repos The repository data
 * @param  {string} username The current username
 *
 * @return {object}      An action object with a type of GET_USER_DETAILS.SUCCESS passing the repos
 */
export function getUserDetailSuccess(user, popout) {
  return {
    type: GET_USER_DETAILS.SUCCESS,
    user,
    popout,
  };
}

/**
 * Dispatched when loading the repositories fails
 *
 * @param  {object} error The error
 *
 * @return {object}       An action object with a type of GET_USER_DETAILS.FAILURE passing the error
 */
export function getUserDetailFailure(error) {
  return {
    type: GET_USER_DETAILS.FAILURE,
    error,
  };
}

/**
 * Dispatched when loading the repositories fails
 *
 * @param  {object} error The error
 *
 * @return {object}       An action object with a type of GET_USER_DETAILS.FAILURE passing the error
 */
export function clearData() {
  return {
    type: CLEAR_DATA,
  };
}
