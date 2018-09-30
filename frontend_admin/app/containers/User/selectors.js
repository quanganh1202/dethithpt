/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHome = state => state.get('user', initialState);

const makeSelectUsers = () =>
  createSelector(selectHome, userState => userState.get('users').toJS());

const makeSelectTotalUser = () =>
  createSelector(selectHome, userState => userState.get('total'));

const makeSelectLoading = () =>
  createSelector(selectHome, userState => userState.get('loading'));

const makeSelectDataInit = () =>
  createSelector(selectHome, userState => userState.get('dataInit').toJS());

export {
  selectHome,
  makeSelectUsers,
  makeSelectLoading,
  makeSelectTotalUser,
  makeSelectDataInit,
};
