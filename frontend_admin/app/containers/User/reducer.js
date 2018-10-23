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
import { GET_USERS, GET_DATA_INIT, GET_HISTORY, CLEAR_DATA, DELETE_USERS, CLEAR_PROCESS_STATUS } from './constants';

// The initial state of the App
export const initialState = fromJS({
  users: [],
  total: 0,
  dataInit: {
    classes: [],
    purchaseHistory: {},
  },
  userHistory: {
    data: [],
    type: 0,
  },
  query: {},
  processDone: false,
});

function userReducer(state = initialState, action) {
  switch (action.type) {
    case GET_USERS.REQUEST:
      return state
        .set('loading', true)
        .set('query', fromJS(action.query));
    case GET_USERS.SUCCESS:
      return state
        .set('loading', false)
        .set('users', fromJS(action.users))
        .set('total', action.total);
    case GET_DATA_INIT.REQUEST:
      return state.set('loading', true);
    case GET_DATA_INIT.SUCCESS:
      return state.set('loading', false).set('dataInit', fromJS(action.data));
    case GET_HISTORY.REQUEST:
      return state
        .set('loading', true)
        .setIn(['userHistory', 'type'], action.historyType);
    case GET_HISTORY.SUCCESS:
      return state
        .set('loading', false)
        .setIn(['userHistory', 'data'], fromJS(action.data));
    case CLEAR_DATA:
      return action.all
        ? initialState : state.set('userHistory', fromJS({ data: [], type: 0 }));
    case DELETE_USERS.REQUEST:
      return state.set('loading', true);
    case DELETE_USERS.SUCCESS:
      return state
        .set('loading', false)
        .set('processDone', true);
    case CLEAR_PROCESS_STATUS:
      return state.set('processDone', false);
    default:
      return state;
  }
}

export default userReducer;
