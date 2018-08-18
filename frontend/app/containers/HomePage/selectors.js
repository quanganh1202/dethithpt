/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHome = state => state.get('home', initialState);

const makeSelectUser = () =>
  createSelector(selectHome, homeState => homeState.get('user'));

const makeSelectLoading = () =>
  createSelector(selectHome, homeState => homeState.get('loading'));

export { selectHome, makeSelectUser, makeSelectLoading };
