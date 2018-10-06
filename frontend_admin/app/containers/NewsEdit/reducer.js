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
  UPDATE_NEWS,
  CLEAR_MESSAGE,
  CLEAR_DATA,
  GET_NEWS_DETAIL,
} from './constants';

// The initial state of the App
export const initialState = fromJS({
  message: '',
  news: {},
});

function newsCreateReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_NEWS.REQUEST:
      return state.set('loading', true);
    case UPDATE_NEWS.SUCCESS:
      return state.set('loading', false);
    case UPDATE_NEWS.FAILURE:
      return state
        .set('loading', false)
        .set('message', action.error);
    case GET_NEWS_DETAIL.REQUEST:
      return state.set('loading', true);
    case GET_NEWS_DETAIL.SUCCESS:
      return state
        .set('loading', false)
        .set('news', fromJS(action.data));
    case GET_NEWS_DETAIL.FAILURE:
      return state
        .set('loading', false)
        .set('message', fromJS(action.error));
    case CLEAR_MESSAGE:
      return state.set('message', '');
    case CLEAR_DATA:
      return state.set('news', fromJS({}));
    default:
      return state;
  }
}

export default newsCreateReducer;
