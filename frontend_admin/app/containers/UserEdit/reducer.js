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
  UPDATE_USER,
  GET_USER_DETAIL,
  CLEAR_MESSAGE,
  CLEAR_DATA,
  GET_DATA_INIT,
} from './constants';

// The initial state of the App
export const initialState = fromJS({
  message: '',
  user: {},
  loading: false,
  dataInit: {
    categories: [],
    subjects: [],
    classes: [],
    collections: [],
  },
});

function classEditReducer(state = initialState, action) {
  switch (action.type) {
    case GET_USER_DETAIL.REQUEST:
      return state.set('loading', true);
    case GET_USER_DETAIL.SUCCESS:
      return state.set('loading', false).set('user', fromJS(action.data));
    case UPDATE_USER.REQUEST:
      return state.set('loading', true);
    case UPDATE_USER.SUCCESS:
      return state.set('loading', false);
    case GET_USER_DETAIL.FAILURE:
    case UPDATE_USER.FAILURE:
      return state.set('loading', false).set('message', action.error);
    case CLEAR_MESSAGE:
      return state.set('message', '');
    case CLEAR_DATA:
      return state.set('user', {});
    case GET_DATA_INIT.REQUEST:
      return state.set('loading', true);
    case GET_DATA_INIT.SUCCESS:
      return state.set('loading', false).set('dataInit', fromJS(action.data));
    default:
      return state;
  }
}

export default classEditReducer;
