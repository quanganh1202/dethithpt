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
  EDIT_DOC,
  GET_DOC_DETAIL,
  GET_DATA_INIT,
  CLEAR_MESSAGE,
} from './constants';

// The initial state of the App
export const initialState = fromJS({
  document: {},
  message: '',
  dataInit: {
    categories: [],
    subjects: [],
    classes: [],
    collections: [],
    tags: [],
  }
});

function docEditReducer(state = initialState, action) {
  switch (action.type) {
    case GET_DOC_DETAIL.REQUEST:
      return state.set('loading', true);
    case GET_DOC_DETAIL.SUCCESS:
      return state
        .set('loading', false)
        .set('document', fromJS(action.data));
    case EDIT_DOC.REQUEST:
      return state.set('loading', true);
    case EDIT_DOC.SUCCESS:
      return state.set('loading', false).set('message', 'Cập nhật thành công!');
    case EDIT_DOC.FAILURE:
      return state
        .set('loading', false)
        .set('error', action.error);
    case GET_DATA_INIT.REQUEST:
      return state.set('loading', true);
    case GET_DATA_INIT.SUCCESS:
      return state
        .set('loading', false)
        .set('dataInit', fromJS(action.data));
    case CLEAR_MESSAGE:
      return state.set('message', '').set('error', '');
    default:
      return state;
  }
}

export default docEditReducer;
