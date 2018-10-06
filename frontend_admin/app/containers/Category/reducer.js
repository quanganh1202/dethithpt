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
  GET_CATEGORIES_REQUEST,
  GET_CATEGORIES_SUCCESS,
  DELETE_CATES,
  CLEAR_PROCESS_STATUS,
  UPDATE_CATES,
} from './constants';

// The initial state of the App
export const initialState = fromJS({
  categories: [],
  processDone: false,
});

function categoryReducer(state = initialState, action) {
  switch (action.type) {
    case GET_CATEGORIES_REQUEST:
      return state.set('loading', true);
    case GET_CATEGORIES_SUCCESS:
      return state
        .set('loading', false)
        .set('categories', fromJS(action.categories));
    case DELETE_CATES.REQUEST:
      return state.set('loading', true);
    case DELETE_CATES.SUCCESS:
      return state
        .set('loading', false)
        .set('processDone', true);
    case CLEAR_PROCESS_STATUS:
      const newState = action.all ? state.set('categories', fromJS([])) : state; 
      return newState.set('processDone', false);
    case UPDATE_CATES.REQUEST:
      return state.set('loading', true);
    case UPDATE_CATES.SUCCESS:
      return state
        .set('loading', false)
        .set('processDone', true);
    default:
      return state;
  }
}

export default categoryReducer;
