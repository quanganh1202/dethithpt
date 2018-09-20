/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHome = state => state.get('user', initialState);

const makeSelectUsers = () =>
  createSelector(selectHome, userState => userState.get('users').toJS());

const makeSelectLoading = () =>
  createSelector(selectHome, userState => userState.get('loading'));

export {
  selectHome,
  makeSelectUsers,
  makeSelectLoading,
};
