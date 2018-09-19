/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHome = state => state.get('subjectCreate', initialState);

const makeSelectMessage = () =>
  createSelector(selectHome, subjectState => subjectState.get('message'));

const makeSelectLoading = () =>
  createSelector(selectHome, subjectState => subjectState.get('loading'));

export {
  selectHome,
  makeSelectMessage,
  makeSelectLoading,
};
