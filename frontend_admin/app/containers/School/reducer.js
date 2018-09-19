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
  GET_SCHOOLS,
} from './constants';

// The initial state of the App
export const initialState = fromJS({
  schools: [],
});

function schoolReducer(state = initialState, action) {
  switch (action.type) {
    case GET_SCHOOLS.REQUEST:
      return state.set('loading', true);
    case GET_SCHOOLS.SUCCESS:
      return state
        .set('loading', false)
        .set('schools', fromJS(action.schools));
    default:
      return state;
  }
}

export default schoolReducer;
