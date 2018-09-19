/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHome = state => state.get('collectionCreate', initialState);

const makeSelectMessage = () =>
  createSelector(selectHome, collectionState => collectionState.get('message'));

const makeSelectLoading = () =>
  createSelector(selectHome, collectionState => collectionState.get('loading'));

const makeSelectInitData = () =>
  createSelector(selectHome, collectionState => collectionState.get('initData').toJS());

export {
  selectHome,
  makeSelectMessage,
  makeSelectLoading,
  makeSelectInitData,
};
