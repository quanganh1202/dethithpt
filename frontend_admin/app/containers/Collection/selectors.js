/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHome = state => state.get('collection', initialState);

const makeSelectCollections = () =>
  createSelector(selectHome, collectionState => collectionState.get('collections').toJS());

const makeSelectTotalCollection = () =>
  createSelector(selectHome, userState => userState.get('total'));

const makeSelectLoading = () =>
  createSelector(selectHome, collectionState => collectionState.get('loading'));
  
const makeSelectProcessStatus = () =>
  createSelector(selectHome, collectionState => collectionState.get('processDone'));

const makeSelectDataInit = () =>
  createSelector(selectHome, documentState => documentState.get('dataInit').toJS());

export {
  selectHome,
  makeSelectCollections,
  makeSelectTotalCollection,
  makeSelectLoading,
  makeSelectProcessStatus,
  makeSelectDataInit,
};
