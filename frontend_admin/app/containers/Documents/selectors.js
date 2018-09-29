/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHome = state => state.get('document', initialState);

const makeSelectDocuments = () =>
  createSelector(selectHome, documentState => documentState.get('documents').toJS());

const makeSelectDataInit = () =>
  createSelector(selectHome, documentState => documentState.get('dataInit').toJS());

const makeSelectTotalUser = () =>
  createSelector(selectHome, documentState => documentState.get('total'));

const makeSelectLoading = () =>
  createSelector(selectHome, documentState => documentState.get('loading'));

const makeSelectDeleteStatus = () =>
  createSelector(selectHome, documentState => documentState.get('deleteSuccess'));

export {
  selectHome,
  makeSelectDocuments,
  makeSelectLoading,
  makeSelectTotalUser,
  makeSelectDeleteStatus,
  makeSelectDataInit,
};
