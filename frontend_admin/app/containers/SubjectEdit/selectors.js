/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHome = state => state.get('subjectEdit', initialState);

const makeSelectMessage = () =>
  createSelector(selectHome, subjectState => subjectState.get('message'));

const makeSelectLoading = () =>
  createSelector(selectHome, subjectState => subjectState.get('loading'));

const makeSelectSubject = () =>
  createSelector(selectHome, subjectState => subjectState.get('data'));

export { selectHome, makeSelectMessage, makeSelectLoading, makeSelectSubject };
