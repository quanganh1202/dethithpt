/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHome = state => state.get('category', initialState);

const makeSelectCategories = () =>
  createSelector(selectHome, categoryState => categoryState.get('categories').toJS());

const makeSelectLoading = () =>
  createSelector(selectHome, categoryState => categoryState.get('loading'));

export {
  selectHome,
  makeSelectCategories,
  makeSelectLoading,
};
