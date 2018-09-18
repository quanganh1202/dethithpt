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

export {
  selectHome,
  makeSelectCollections,
  makeSelectLoading,
};
