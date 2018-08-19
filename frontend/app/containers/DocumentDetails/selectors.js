/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHome = state => state.get('documentDetails', initialState);

const makeSelectDocument = () =>
  createSelector(selectHome, homeState => homeState.get('document').toJS());

const makeSelectLoading = () =>
  createSelector(selectHome, homeState => homeState.get('loading'));

const makeSelectDocuments = () =>
  createSelector(selectHome, homeState => homeState.get('documents').toJS());

export {
  selectHome,
  makeSelectDocument,
  makeSelectLoading,
  makeSelectDocuments,
};
