/**
 * SearchResult selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHome = state => state.get('searchResult', initialState);

const makeSelectLoading = () =>
  createSelector(selectHome, searchState => searchState.get('loading'));

const makeSelectDocuments = () =>
  createSelector(selectHome, searchState =>
    searchState.get('documents').toJS(),
  );

export { selectHome, makeSelectLoading, makeSelectDocuments };
