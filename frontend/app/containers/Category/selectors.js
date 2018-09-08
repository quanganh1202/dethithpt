/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHome = state => state.get('category', initialState);

const makeSelectDocument = () =>
  createSelector(selectHome, categoryState => categoryState.get('document').toJS());

const makeSelectLoading = () =>
  createSelector(selectHome, categoryState => categoryState.get('loading'));

const makeSelectDocuments = () =>
  createSelector(selectHome, categoryState => categoryState.get('documents').toJS());

const makeSelectFilterData = () =>
  createSelector(selectHome, categoryState => categoryState.get('filterData').toJS());

export {
  selectHome,
  makeSelectDocument,
  makeSelectLoading,
  makeSelectDocuments,
  makeSelectFilterData,
};
