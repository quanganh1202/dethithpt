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
  GET_USERS,
} from './constants';

// The initial state of the App
export const initialState = fromJS({
  users: [],
  total: 0,
});

function userReducer(state = initialState, action) {
  switch (action.type) {
    case GET_USERS.REQUEST:
      return state.set('loading', true);
    case GET_USERS.SUCCESS:
      return state
        .set('loading', false)
        .set('users', fromJS(action.users))
        .set('total', action.total);
    default:
      return state;
  }
}

export default userReducer;
