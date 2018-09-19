/*
 * HomeReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */
import { fromJS } from 'immutable';
import {
  GET_USER_DETAILS,
} from './constants';
import { setToken, mappingUser } from 'services/auth';

// The initial state of the App
export const initialState = fromJS({
  user: null,
  message: ''
});

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case GET_USER_DETAILS.REQUEST:
      return state.set('loading', true);
    case GET_USER_DETAILS.SUCCESS:
      return state
        .set('loading', false)
        .set('user', action.user);
    case GET_USER_DETAILS.FAILURE:
      return state.set('loading', true);
    default:
      return state;
  }
}

export default homeReducer;
