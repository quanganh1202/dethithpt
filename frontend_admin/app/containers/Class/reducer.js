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
  GET_CLASSES,
} from './constants';

// The initial state of the App
export const initialState = fromJS({
  classes: [],
});

function classReducer(state = initialState, action) {
  switch (action.type) {
    case GET_CLASSES.REQUEST:
      return state.set('loading', true);
    case GET_CLASSES.SUCCESS:
      return state
        .set('loading', false)
        .set('classes', fromJS(action.classes));
    default:
      return state;
  }
}

export default classReducer;
