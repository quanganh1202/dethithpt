/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHome = state => state.get('document', initialState);

const makeSelectDocuments = () =>
  createSelector(selectHome, documentState => documentState.get('documents').toJS());

const makeSelectTotalUser = () =>
  createSelector(selectHome, documentState => documentState.get('total'));

const makeSelectLoading = () =>
  createSelector(selectHome, documentState => documentState.get('loading'));

export {
  selectHome,
  makeSelectDocuments,
  makeSelectLoading,
  makeSelectTotalUser,
};
