/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectUserInformation = state => state.get('userInformation', initialState);

const makeSelectUser = () =>
  createSelector(selectUserInformation, homeState => homeState.get('user'));

const makeSelectHistory = () =>
  createSelector(selectUserInformation, homeState => homeState.get('history'));

const makeSelectUpload = () =>
  createSelector(selectUserInformation, homeState => homeState.get('upload'));

const makeSelectDownload = () =>
  createSelector(selectUserInformation, homeState => homeState.get('download'));

const makeSelectLoading = () =>
  createSelector(selectUserInformation, homeState => homeState.get('loading'));

export {
  selectHome,
  makeSelectUser,
  makeSelectHistory,
  makeSelectUpload,
  makeSelectDownload,
  makeSelectLoading,
};
