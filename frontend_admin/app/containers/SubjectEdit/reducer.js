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
  UPDATE_SUBJECT,
  GET_SUBJECT_DETAIL,
  CLEAR_MESSAGE,
  CLEAR_DATA,
} from './constants';

// The initial state of the App
export const initialState = fromJS({
  message: '',
  data: {},
});

function subjectEditReducer(state = initialState, action) {
  switch (action.type) {
    case GET_SUBJECT_DETAIL.REQUEST:
      return state.set('loading', true);
    case GET_SUBJECT_DETAIL.SUCCESS:
      return state.set('loading', false).set('data', action.data);
    case UPDATE_SUBJECT.REQUEST:
      return state.set('loading', true);
    case UPDATE_SUBJECT.SUCCESS:
      return state.set('loading', false);
    case GET_SUBJECT_DETAIL.FAILURE:
    case UPDATE_SUBJECT.FAILURE:
      return state.set('loading', false).set('message', action.error);
    case CLEAR_MESSAGE:
      return state.set('message', '');
    case CLEAR_DATA:
      return state.set('data', {});
    default:
      return state;
  }
}

export default subjectEditReducer;
