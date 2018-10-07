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
  GET_NEWS,
  DELETE_NEWS,
  CLEAR_PROCESS_STATUS,
} from './constants';

// The initial state of the App
export const initialState = fromJS({
  news: [],
  processDone: false,
});

function newsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_NEWS.REQUEST:
      return state.set('loading', true);
    case GET_NEWS.SUCCESS:
      return state
        .set('loading', false)
        .set('news', fromJS(action.news));
    case CLEAR_PROCESS_STATUS:
      const newState = action.all ? state.set('news', fromJS([])) : state; 
      return newState.set('processDone', false);
    case DELETE_NEWS.REQUEST:
      return state.set('loading', true);
    case DELETE_NEWS.SUCCESS:
      return state
        .set('loading', false)
        .set('processDone', true);
    default:
      return state;
  }
}

export default newsReducer;
