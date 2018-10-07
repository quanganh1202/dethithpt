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
  UPDATE_CATEGORY,
  GET_CATEGORY_DETAIL,
  CLEAR_DATA,
  CLEAR_MESSAGE,
} from './constants';

// The initial state of the App
export const initialState = fromJS({
  message: '',
  data: {},
  loading: false,
});

function categoryEditReducer(state = initialState, action) {
  switch (action.type) {
    case GET_CATEGORY_DETAIL.REQUEST:
      return state.set('loading', true);
    case GET_CATEGORY_DETAIL.SUCCESS:
      return state.set('loading', false).set('data', action.data);
    case UPDATE_CATEGORY.REQUEST:
      return state.set('loading', true);
    case UPDATE_CATEGORY.SUCCESS:
      return state.set('loading', false);
    case GET_CATEGORY_DETAIL.FAILURE:
    case UPDATE_CATEGORY.FAILURE:
      return state.set('loading', false).set('message', action.error);
    case CLEAR_MESSAGE:
      return state.set('message', '');
    case CLEAR_DATA:
      return state.set('data', fromJS({}));
    default:
      return state;
  }
}

export default categoryEditReducer;
