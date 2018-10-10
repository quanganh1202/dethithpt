/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHome = state => state.get('class', initialState);

const makeSelectClasses = () =>
  createSelector(selectHome, classState => classState.get('classes').toJS());

const makeSelectTotalClass = () =>
  createSelector(selectHome, userState => userState.get('total'));

const makeSelectLoading = () =>
  createSelector(selectHome, classState => classState.get('loading'));

const makeSelectProcessStatus = () =>
  createSelector(selectHome, classState => classState.get('processDone'));

export {
  selectHome,
  makeSelectClasses,
  makeSelectTotalClass,
  makeSelectLoading,
  makeSelectProcessStatus,
};
