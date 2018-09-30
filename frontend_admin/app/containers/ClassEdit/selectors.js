/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHome = state => state.get('classEdit', initialState);

const makeSelectMessage = () =>
  createSelector(selectHome, classState => classState.get('message'));

const makeSelectLoading = () =>
  createSelector(selectHome, classState => classState.get('loading'));

const makeSelectClass = () =>
  createSelector(selectHome, classState => classState.get('data'));

export { selectHome, makeSelectMessage, makeSelectLoading, makeSelectClass };
