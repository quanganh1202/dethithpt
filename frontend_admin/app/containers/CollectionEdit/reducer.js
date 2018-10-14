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
  UPDATE_COLLECTION,
  GET_INIT_DATA,
  CLEAR_MESSAGE,
  CLEAR_DATA,
  GET_COLLECTION_DETAIL,
} from './constants';

// The initial state of the App
export const initialState = fromJS({
  message: '',
  collection: {},
  initData: {
    categories: [],
    subjects: [],
    classes: [],
  },
});

function collectionCreateReducer(state = initialState, action) {
  switch (action.type) {
    case GET_COLLECTION_DETAIL.REQUEST:
      return state.set('loading', true);
    case GET_COLLECTION_DETAIL.SUCCESS:
      return state.set('loading', false).set('collection', action.data);
    case UPDATE_COLLECTION.REQUEST:
      return state.set('loading', true);
    case UPDATE_COLLECTION.SUCCESS:
      return state.set('loading', false);
    case GET_COLLECTION_DETAIL:
    case UPDATE_COLLECTION.FAILURE:
      return state.set('loading', false).set('message', action.error);
    case GET_INIT_DATA.REQUEST:
      return state.set('loading', true);
    case GET_INIT_DATA.SUCCESS:
      return state
        .set('loading', false)
        .setIn(['initData', 'categories'], action.categories)
        .setIn(['initData', 'subjects'], action.subjects)
        .setIn(['initData', 'classes'], action.classes);
    case GET_INIT_DATA.FAILURE:
      return state.set('loading', false).set('message', action.error);
    case CLEAR_MESSAGE:
      return state.set('message', '');
    case CLEAR_DATA:
      return state.set('collection', fromJS({}));
    default:
      return state;
  }
}

export default collectionCreateReducer;
