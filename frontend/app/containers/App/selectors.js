/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectGlobal = state => state.get('global');

const makeSelectCurrentUser = () =>
  createSelector(selectGlobal, globalState => globalState.get('user'));

const makeSelectMenu = () =>
  createSelector(selectGlobal, globalState => globalState.get('menu'));

const makeSelectPopout = () =>
  createSelector(selectGlobal, globalState => globalState.get('popout'));

export {
  selectGlobal,
  makeSelectCurrentUser,
  makeSelectMenu,
  makeSelectPopout,
};
