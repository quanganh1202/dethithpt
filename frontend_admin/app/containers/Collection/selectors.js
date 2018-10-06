/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHome = state => state.get('collection', initialState);

const makeSelectCollections = () =>
  createSelector(selectHome, collectionState => collectionState.get('collections').toJS());

const makeSelectLoading = () =>
  createSelector(selectHome, collectionState => collectionState.get('loading'));
  
const makeSelectProcessStatus = () =>
  createSelector(selectHome, collectionState => collectionState.get('processDone'));

export {
  selectHome,
  makeSelectCollections,
  makeSelectLoading,
  makeSelectProcessStatus
};
