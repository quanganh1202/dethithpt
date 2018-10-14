/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHome = state => state.get('login', initialState);

const makeSelectLoading = () =>
  createSelector(selectHome, homeState => homeState.get('loading'));

const makeSelectMessage = () =>
  createSelector(selectHome, homeState => homeState.get('message'));

export {
  selectHome,
  makeSelectLoading,
  makeSelectMessage,
};
