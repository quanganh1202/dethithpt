/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectUserInformation = state => state.get('userInformation', initialState);

const makeSelectUser = () =>
  createSelector(selectUserInformation, homeState => homeState.get('user'));

const makeSelectLoading = () =>
  createSelector(selectUserInformation, homeState => homeState.get('loading'));

export {
  selectHome,
  makeSelectUser,
  makeSelectLoading,
  makeSelectDocuments,
  makeSelectCategories,
  makeSelectCollections,
};
