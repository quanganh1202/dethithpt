/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHome = state => state.get('newsCreate', initialState);

const makeSelectMessage = () =>
  createSelector(selectHome, newsState => newsState.get('message'));

const makeSelectLoading = () =>
  createSelector(selectHome, newsState => newsState.get('loading'));

export {
  selectHome,
  makeSelectMessage,
  makeSelectLoading,
};
