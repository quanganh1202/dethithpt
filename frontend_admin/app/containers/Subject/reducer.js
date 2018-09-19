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
  GET_SUBJECTS,
} from './constants';

// The initial state of the App
export const initialState = fromJS({
  subjects: [],
});

function subjectReducer(state = initialState, action) {
  switch (action.type) {
    case GET_SUBJECTS.REQUEST:
      return state.set('loading', true);
    case GET_SUBJECTS.SUCCESS:
      return state
        .set('loading', false)
        .set('subjects', fromJS(action.subjects));
    default:
      return state;
  }
}

export default subjectReducer;
