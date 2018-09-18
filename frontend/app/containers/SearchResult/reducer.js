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
  GET_DOC_DETAILS_REQUEST,
  GET_DOC_DETAILS_SUCCESS,
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
  document: {},
  loading: false,
  documents: {
    data: [],
    total: 0,
    query: null,
  },
});

function documentReducer(state = initialState, action) {
  switch (action.type) {
    case GET_DOC_DETAILS_REQUEST:
      return state.set('loading', true);
    case GET_DOC_DETAILS_SUCCESS:
      return state
        .set('loading', false)
        .set('document', fromJS(action.data));
    case GET_DOC_LIST_REQUEST:
      if (action.clear) {
        return state
          .set('loading', true)
          .set('documents', fromJS({
            data: [],
            total: 0,
            query: action.query,
          }))
      }
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

export default documentReducer;
