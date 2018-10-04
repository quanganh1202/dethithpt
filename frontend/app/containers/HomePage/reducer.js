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

import { setToken, mappingUser } from 'services/auth';
import {
  LOGIN_SUCCESS,
  LOGIN_REQUEST,
  UPDATE_USER_INFO_REQUEST,
  UPDATE_USER_INFO_SUCCESS,
  UPDATE_USER_INFO_FAILURE,
  GET_DOC_LIST_REQUEST,
  GET_DOC_LIST_SUCCESS,
  GET_CATE_LIST_REQUEST,
  GET_CATE_LIST_SUCCESS,
  GET_COLLECTION_LIST_REQUEST,
  GET_COLLECTION_LIST_SUCCESS,
  GET_TAGS_REQUEST,
  GET_TAGS_SUCCESS,
  REQUEST_DOWNLOAD,
  REQUEST_PURCHASE,
  REMOVE_FILE_SAVE,
  REMOVE_MESSAGE,
  GET_NEWS,
  QUERY_DATA,
} from './constants';

// The initial state of the App
export const initialState = fromJS({
  user: null,
  loading: false,
  documents: {
    data: [],
    total: 0,
    query: null,
  },
  categories: [],
  collections: [],
  tags: [],
  file: null,
  message: '',
  news: [],
  token: '',
});

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case '@@router/LOCATION_CHANGE':
      return state.set(
        'documents',
        fromJS({
          data: [],
          total: 0,
          query: null,
        }),
      );
    case LOGIN_REQUEST:
      return state.set('loading', true);
    case LOGIN_SUCCESS: {
      const user = mappingUser(action.payload.token);
      if (user.status === 2) {
        return state
          .set('user', user)
          .set('loading', false)
          .set('token', action.payload.token);
      }
      setToken(action.payload.token);
      return state.set('loading', false);
    }
    case UPDATE_USER_INFO_REQUEST:
      return state
        .set('loading', true);
    case UPDATE_USER_INFO_SUCCESS:
      setToken(action.payload.token);
      return state
        .set('loading', false)
        .set('user', null)
        .set('token', '')
        .set('message', '');
    case UPDATE_USER_INFO_FAILURE:
      return state
        .set('loading', false)
        .set('message', 'registered_phone_number');
    case GET_DOC_LIST_REQUEST:
      return state
        .set('loading', true)
        .setIn(['documents', 'query'], action.query);
    case GET_DOC_LIST_SUCCESS: {
      const documents = state
        .getIn(['documents', 'data'])
        .push(...fromJS(action.documents));
      return state.set('loading', false).set(
        'documents',
        fromJS({
          data: documents,
          total: action.total,
          query: state.getIn(['documents', 'query']),
        }),
      );
    }
    case GET_CATE_LIST_REQUEST:
      return state.set('loading', true);
    case GET_CATE_LIST_SUCCESS:
      return state
        .set('loading', false)
        .set('categories', fromJS(action.categories));
    case GET_COLLECTION_LIST_REQUEST:
      return state.set('loading', true).set('queryCollection', action.queryCollection);
    case GET_COLLECTION_LIST_SUCCESS:
      return state
        .set('loading', false)
        .set('collections', fromJS(action.collections));
    case GET_TAGS_REQUEST:
      return state.set('loading', true);
    case GET_TAGS_SUCCESS:
      return state.set('loading', false).set('tags', fromJS(action.tags));
    case GET_NEWS.REQUEST:
      return state.set('loading', true);
    case GET_NEWS.SUCCESS:
      return state.set('loading', false).set('news', fromJS(action.news));
    case REQUEST_DOWNLOAD.REQUEST:
      return state.set('loading', true);
    case REQUEST_DOWNLOAD.SUCCESS:
      return state.set('loading', false).set('file', action.file);
    case REQUEST_DOWNLOAD.FAILURE:
      return state.set('loading', false).set('message', action.message);
    case REQUEST_PURCHASE.REQUEST:
      return state.set('loading', true);
    case REQUEST_PURCHASE.SUCCESS:
      return state.set('loading', false);
    case REQUEST_PURCHASE.FAILURE:
      return state.set('loading', false).set('message', action.message);
    case REMOVE_FILE_SAVE:
      return state.set('file', null);
    case REMOVE_MESSAGE:
      return state.set('message', '');
    case QUERY_DATA:
      return state.set('queryCollection', action.queryCollection);
    default:
      return state;
  }
}

export default homeReducer;
