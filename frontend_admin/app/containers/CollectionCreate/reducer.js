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
  CREATE_COLLECTION,
  GET_INIT_DATA,
  CLEAR_MESSAGE,
} from './constants';

// The initial state of the App
export const initialState = fromJS({
  message: '',
  initData: {
    categories: [],
    subjects: [],
    classes: [],
  },
});

function collectionCreateReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_COLLECTION.REQUEST:
      return state.set('loading', true);
    case CREATE_COLLECTION.SUCCESS:
      return state.set('loading', false);
    case CREATE_COLLECTION.FAILURE:
      return state
        .set('loading', false)
        .set('message', action.error);
    case GET_INIT_DATA.REQUEST:
      return state.set('loading', true);
    case GET_INIT_DATA.SUCCESS:
      return state
        .set('loading', false)
        .setIn(['initData', 'categories'], action.categories)
        .setIn(['initData', 'subjects'], action.subjects)
        .setIn(['initData', 'classes'], action.classes);
    case GET_INIT_DATA.FAILURE:
      return state
        .set('loading', false)
        .set('message', action.error);
    case CLEAR_MESSAGE:
      return state.set('message', '');
    default:
      return state;
  }
}

export default collectionCreateReducer;
