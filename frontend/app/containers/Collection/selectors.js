/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHome = state => state.get('collection', initialState);

const makeSelectCollection = () =>
  createSelector(selectHome, collectionState => collectionState.get('collection').toJS());

const makeSelectLoading = () =>
  createSelector(selectHome, collectionState => collectionState.get('loading'));

const makeSelectDocuments = () =>
  createSelector(selectHome, collectionState => collectionState.get('documents').toJS());

export {
  selectHome,
  makeSelectCollection,
  makeSelectLoading,
  makeSelectDocuments,
  makeSelectFilterData,
};
