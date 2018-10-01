/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHome = state => state.get('news', initialState);

const makeSelectNews = () =>
  createSelector(selectHome, newsState => newsState.get('news').toJS());

const makeSelectLoading = () =>
  createSelector(selectHome, newsState => newsState.get('loading'));

export {
  selectHome,
  makeSelectNews,
  makeSelectLoading,
};
