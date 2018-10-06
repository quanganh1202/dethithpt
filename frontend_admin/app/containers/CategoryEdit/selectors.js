/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHome = state => state.get('categoryEdit', initialState);

const makeSelectMessage = () =>
  createSelector(selectHome, categoryState => categoryState.get('message'));

const makeSelectLoading = () =>
  createSelector(selectHome, categoryState => categoryState.get('loading'));

const makeSelectData = () =>
  createSelector(selectHome, categoryState => categoryState.get('data'));

export { selectHome, makeSelectMessage, makeSelectLoading, makeSelectData };
