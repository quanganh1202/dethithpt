/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHome = state => state.get('classCreate', initialState);

const makeSelectMessage = () =>
  createSelector(selectHome, classState => classState.get('message'));

const makeSelectLoading = () =>
  createSelector(selectHome, classState => classState.get('loading'));

export {
  selectHome,
  makeSelectMessage,
  makeSelectLoading,
};
