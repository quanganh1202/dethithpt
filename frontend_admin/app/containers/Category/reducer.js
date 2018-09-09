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
} from './constants';

// The initial state of the App
export const initialState = fromJS({
  categories: [],
});

function categoryReducer(state = initialState, action) {
  switch (action.type) {
    case GET_CATEGORIES_REQUEST:
      return state.set('loading', true);
    case GET_CATEGORIES_SUCCESS:
      return state
        .set('loading', false)
        .set('categories', fromJS(action.categories));
    default:
      return state;
  }
}

export default categoryReducer;
