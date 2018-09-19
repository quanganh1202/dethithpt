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
  CREATE_CLASS,
  CLEAR_MESSAGE,
} from './constants';

// The initial state of the App
export const initialState = fromJS({
  message: ''
});

function classCreateReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_CLASS.REQUEST:
      return state.set('loading', true);
    case CREATE_CLASS.SUCCESS:
      return state.set('loading', false);
    case CREATE_CLASS.FAILURE:
      return state
        .set('loading', false)
        .set('message', action.error);
    case CLEAR_MESSAGE:
      return state.set('message', '');
    default:
      return state;
  }
}

export default classCreateReducer;
