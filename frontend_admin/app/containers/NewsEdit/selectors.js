/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHome = state => state.get('newsEdit', initialState);

const makeSelectMessage = () =>
  createSelector(selectHome, newsState => newsState.get('message'));

const makeSelectLoading = () =>
  createSelector(selectHome, newsState => newsState.get('loading'));

const makeSelectNewsDetail = () =>
  createSelector(selectHome, newsState => newsState.get('news').toJS());

export {
  selectHome,
  makeSelectMessage,
  makeSelectLoading,
  makeSelectNewsDetail,
};
