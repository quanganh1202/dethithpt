/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHome = state => state.get('subject', initialState);

const makeSelectSubjects = () =>
  createSelector(selectHome, subjectState => subjectState.get('subjects').toJS());

const makeSelectLoading = () =>
  createSelector(selectHome, subjectState => subjectState.get('loading'));

export {
  selectHome,
  makeSelectSubjects,
  makeSelectLoading,
};
