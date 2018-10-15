/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHome = state => state.get('documentTest', initialState);

const makeSelectDocument = () =>
  createSelector(selectHome, homeState => homeState.get('document').toJS());

const makeSelectLoading = () =>
  createSelector(selectHome, homeState => homeState.get('loading'));

const makeSelectDocuments = () =>
  createSelector(selectHome, homeState => homeState.get('documents').toJS());

const makeSelectFile = () =>
  createSelector(selectHome, homeState => homeState.get('file'));

const makeSelectMessage = () =>
  createSelector(selectHome, homeState => homeState.get('message'));

export {
  selectHome,
  makeSelectDocument,
  makeSelectLoading,
  makeSelectDocuments,
  makeSelectFile,
  makeSelectMessage,
};
