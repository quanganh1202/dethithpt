/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHome = state => state.get('school', initialState);

const makeSelectSchools = () =>
  createSelector(selectHome, schoolState => schoolState.get('subjects').toJS());

const makeSelectLoading = () =>
  createSelector(selectHome, schoolState => schoolState.get('loading'));

export {
  selectHome,
  makeSelectSchools,
  makeSelectLoading,
};
