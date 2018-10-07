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
  GET_COLLECTIONS,
  DELETE_COLLECTIONS,
  CLEAR_PROCESS_STATUS,
  UPDATE_COLLECTIONS,
} from './constants';

// The initial state of the App
export const initialState = fromJS({
  collections: [],
  processDone: false,
});

function collectionReducer(state = initialState, action) {
  switch (action.type) {
    case GET_COLLECTIONS.REQUEST:
      return state.set('loading', true);
    case GET_COLLECTIONS.SUCCESS:
      return state
        .set('loading', false)
        .set('collections', fromJS(action.collections));
    case DELETE_COLLECTIONS.REQUEST:
      return state.set('loading', true);
    case DELETE_COLLECTIONS.SUCCESS:
      return state
        .set('loading', false)
        .set('processDone', true);
    case CLEAR_PROCESS_STATUS:
      const newState = action.all ? state.set('collections', fromJS([])) : state; 
      return newState.set('processDone', false);
    case UPDATE_COLLECTIONS.REQUEST:
      return state.set('loading', true);
    case UPDATE_COLLECTIONS.SUCCESS:
      return state
        .set('loading', false)
        .set('processDone', true);
    default:
      return state;
  }
}

export default collectionReducer;
