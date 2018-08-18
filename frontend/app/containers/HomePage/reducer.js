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
import jwtDecode from 'jwt-decode';
import {
  LOGIN_SUCCESS,
  LOGIN_REQUEST,
  UPDATE_USER_INFO_REQUEST,
  UPDATE_USER_INFO_SUCCESS,
} from './constants';
import { setToken, getUser, mappingUser } from 'services/auth';

const requiredFields = ['name', 'phone', 'bod', 'role', 'city', 'district', 'level', 'school'];

const validate = (input, req) => {
  return req.find((f) => !input[f]);
}

// The initial state of the App
export const initialState = fromJS({
  user: null,
  loading: false,
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
    default:
      return state;
  }
}

export default homeReducer;
