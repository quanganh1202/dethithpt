/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHome = state => state.get('newsDetails', initialState);

const makeSelectNews = () =>
  createSelector(selectHome, homeState => homeState.get('news').toJS());

const makeSelectLoading = () =>
  createSelector(selectHome, homeState => homeState.get('loading'));

export {
  selectHome,
  makeSelectNews,
  makeSelectLoading,
};
