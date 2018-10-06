/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHome = state => state.get('userEdit', initialState);

const makeSelectMessage = () =>
  createSelector(selectHome, userState => userState.get('message'));

const makeSelectLoading = () =>
  createSelector(selectHome, userState => userState.get('loading'));

const makeSelectUser = () =>
  createSelector(selectHome, userState => userState.get('user'));

const makeSelectDataInit = () =>
  createSelector(selectHome, userState => userState.get('dataInit').toJS());

const makeSelectError = () =>
  createSelector(selectHome, userState => userState.get('error'));

export {
  selectHome,
  makeSelectMessage,
  makeSelectLoading,
  makeSelectUser,
  makeSelectDataInit,
  makeSelectError,
};
