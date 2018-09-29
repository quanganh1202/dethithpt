/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHome = state => state.get('documentEdit', initialState);

const makeSelectDocDetail = () =>
  createSelector(selectHome, subjectState => subjectState.get('document').toJS());

const makeSelectDataInit = () =>
  createSelector(selectHome, subjectState => subjectState.get('dataInit').toJS());

const makeSelectMessage = () =>
  createSelector(selectHome, subjectState => subjectState.get('message'));

const makeSelectLoading = () =>
  createSelector(selectHome, subjectState => subjectState.get('loading'));

export {
  selectHome,
  makeSelectDocDetail,
  makeSelectDataInit,
  makeSelectMessage,
  makeSelectLoading,
};
