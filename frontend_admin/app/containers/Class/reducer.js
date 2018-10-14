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
  DELETE_CLASSES,
  CLEAR_PROCESS_STATUS,
  UPDATE_CLASSES,
} from './constants';

// The initial state of the App
export const initialState = fromJS({
  classes: [],
  total: 0,
  processDone: false,
});

function classReducer(state = initialState, action) {
  switch (action.type) {
    case GET_CLASSES.REQUEST:
      return state.set('loading', true);
    case GET_CLASSES.SUCCESS:
      return state
        .set('loading', false)
        .set('total', action.total)
        .set('classes', fromJS(action.classes));
    case DELETE_CLASSES.REQUEST:
      return state.set('loading', true);
    case DELETE_CLASSES.SUCCESS:
      return state
        .set('loading', false)
        .set('processDone', true);
    case CLEAR_PROCESS_STATUS:
      const newState = action.all ? state.set('classes', fromJS([])) : state; 
      return newState.set('processDone', false);
    case UPDATE_CLASSES.REQUEST:
      return state.set('loading', true);
    case UPDATE_CLASSES.SUCCESS:
      return state
        .set('loading', false)
        .set('processDone', true);
    default:
      return state;
  }
}

export default classReducer;
