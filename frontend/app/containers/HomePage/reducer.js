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
  LOGIN_SUCCESS,
  LOGIN_REQUEST,
  UPDATE_USER_INFO_REQUEST,
  UPDATE_USER_INFO_SUCCESS,
  GET_DOC_LIST_REQUEST,
  GET_DOC_LIST_SUCCESS,
} from './constants';
import { setToken, mappingUser } from 'services/auth';

const requiredFields = ['name', 'phone', 'bod', 'role', 'city', 'district', 'level', 'school'];

const validate = (input, req) => {
  return req.find((f) => !input[f]);
}

// The initial state of the App
export const initialState = fromJS({
  user: null,
  loading: false,
  documents: {
    data: [],
    total: 0,
    query: null,
  },
});

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return state.set('loading', true);
    case LOGIN_SUCCESS: {
      const user = mappingUser(action.payload.token);
      if (validate(user, requiredFields)) {
        return state.set('user', user).set('loading', false);
      }
      setToken(action.payload.token);
      return state.set('loading', false);
    }
    case UPDATE_USER_INFO_REQUEST:
      return state.set('loading', true).set('user', null);
    case UPDATE_USER_INFO_SUCCESS:
      setToken(action.payload.token);
      return state.set('loading', false);
    case GET_DOC_LIST_REQUEST:
      console.log('request', action.query);
      return state
        .set('loading', true)
        .setIn(['documents', 'query'], action.query);
    case GET_DOC_LIST_SUCCESS:
      const documents = state.getIn(['documents', 'data']).push(...fromJS(action.documents));
      return state
        .set('loading', false)
        .set('documents', fromJS({
          data: documents,
          total: action.total,
          query: state.getIn(['documents', 'query']),
        }));
    default:
      return state;
  }
}

export default homeReducer;
