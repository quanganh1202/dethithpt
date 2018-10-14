/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHome = state => state.get('subject', initialState);

const makeSelectSubjects = () =>
  createSelector(selectHome, subjectState => subjectState.get('subjects').toJS());

const makeSelectTotalSubject = () =>
  createSelector(selectHome, userState => userState.get('total'));

const makeSelectLoading = () =>
  createSelector(selectHome, subjectState => subjectState.get('loading'));

const makeSelectProcessStatus = () =>
  createSelector(selectHome, subjectState => subjectState.get('processDone'));

export {
  selectHome,
  makeSelectSubjects,
  makeSelectTotalSubject,
  makeSelectLoading,
  makeSelectProcessStatus,
};
