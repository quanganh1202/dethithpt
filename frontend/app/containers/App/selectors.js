/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectGlobal = state => state.get('global');

const makeSelectCurrentUser = () =>
  createSelector(selectGlobal, globalState => globalState.get('user'));

const makeSelectPopout = () =>
  createSelector(selectGlobal, globalState => globalState.get('popout'));

export {
  selectGlobal,
  makeSelectCurrentUser,
  makeSelectPopout,
};
