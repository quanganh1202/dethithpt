/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHome = state => state.get('login', initialState);

const makeSelectLoading = () =>
  createSelector(selectHome, homeState => homeState.get('loading'));

export {
  selectHome,
  makeSelectLoading,
};
