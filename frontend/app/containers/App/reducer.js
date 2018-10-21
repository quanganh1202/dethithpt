/*
 * AppReducer
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

import { GET_USER_DETAILS, CLEAR_DATA, GET_MENU } from './constants';

// The initial state of the App
const initialState = fromJS({
  user: null,
  popout: false,
  menu: [],
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case GET_USER_DETAILS.REQUEST:
      return state
        .set('loading', true);
    case GET_USER_DETAILS.SUCCESS:
      return state
        .set('loading', false)
        .set('popout', action.popout)
        .set('user', action.user);
    case CLEAR_DATA:
      return state.set('popout', false);
    case GET_MENU.REQUEST:
      return state.set('loading', true);
    case GET_MENU.SUCCESS:
      return state.set('loading', false).set('menu', fromJS(action.menu));
    default:
      return state;
  }
}

export default appReducer;
