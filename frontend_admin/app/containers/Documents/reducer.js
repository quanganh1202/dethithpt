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
  GET_DOCS,
  APPROVE_DOCS,
  DELETE_DOC,
  UPDATE_DOCS,
  CLEAR_DELETE_STATUS,
  GET_DATA_INIT,
} from './constants';

// The initial state of the App
export const initialState = fromJS({
  documents: [],
  total: 0,
  deleteSuccess: false,
  updateSuccess: false,
  dataInit: {
    categories: [],
    subjects: [],
    classes: [],
    collections: [],
  }
});

function documentReducer(state = initialState, action) {
  switch (action.type) {
    case GET_DOCS.REQUEST:
      return state.set('loading', true);
    case GET_DOCS.SUCCESS:
      return state
        .set('loading', false)
        .set('documents', fromJS(action.documents))
        .set('total', action.total);
    case APPROVE_DOCS.REQUEST:
      return state.set('loading', true);
    case APPROVE_DOCS.SUCCESS:
      return state
        .set('loading', false)
        .set('deleteSuccess', true);
    case DELETE_DOC.REQUEST:
      return state.set('loading', true);
    case DELETE_DOC.SUCCESS:
      return state
        .set('loading', false)
        .set('deleteSuccess', true);
    case UPDATE_DOCS.REQUEST:
      return state.set('loading', true);
    case UPDATE_DOCS.SUCCESS:
      return state
        .set('loading', false)
        .set('deleteSuccess', true);
    case GET_DATA_INIT.REQUEST:
      return state.set('loading', true);
    case GET_DATA_INIT.SUCCESS:
      return state
        .set('loading', false)
        .set('dataInit', fromJS(action.data));
    case CLEAR_DELETE_STATUS:
      return state.set('deleteSuccess', false);
    default:
      return state;
  }
}

export default documentReducer;
