/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHome = state => state.get('category', initialState);

const makeSelectCategories = () =>
  createSelector(selectHome, categoryState => categoryState.get('categories').toJS());

const makeSelectTotalCate = () =>
  createSelector(selectHome, userState => userState.get('total'));

const makeSelectLoading = () =>
  createSelector(selectHome, categoryState => categoryState.get('loading'));

const makeSelectProcessStatus = () =>
  createSelector(selectHome, categoryState => categoryState.get('processDone'));

export {
  selectHome,
  makeSelectCategories,
  makeSelectTotalCate,
  makeSelectProcessStatus,
  makeSelectLoading,
};
