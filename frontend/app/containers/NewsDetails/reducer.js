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
  GET_NEWS_DETAILS,
} from './constants';

// The initial state of the App
export const initialState = fromJS({
  news: {},
  loading: false,
});

function newsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_NEWS_DETAILS.REQUEST:
      return state.set('loading', true);
    case GET_NEWS_DETAILS.SUCCESS:
      return state
        .set('loading', false)
        .set('news', fromJS(action.data));
    default:
      return state;
  }
}

export default newsReducer;
