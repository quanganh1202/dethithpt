/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHome = state => state.get('categoryCreate', initialState);

const makeSelectMessage = () =>
  createSelector(selectHome, categoryState => categoryState.get('message'));

const makeSelectLoading = () =>
  createSelector(selectHome, categoryState => categoryState.get('loading'));

export {
  selectHome,
  makeSelectMessage,
  makeSelectLoading,
};
