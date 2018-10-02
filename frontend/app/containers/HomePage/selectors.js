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

const makeSelectDocuments = () =>
  createSelector(selectHome, homeState => homeState.get('documents').toJS());

const makeSelectCategories = () =>
  createSelector(selectHome, homeState => homeState.get('categories').toJS());

const makeSelectCollections = () =>
  createSelector(selectHome, homeState => homeState.get('collections').toJS());

const makeSelectTags = () =>
  createSelector(selectHome, homeState => homeState.get('tags').toJS());

const makeSelectNews = () =>
  createSelector(selectHome, homeState => homeState.get('news').toJS());

const makeSelectFile = () =>
  createSelector(selectHome, homeState => homeState.get('file'));

const makeSelectMessage = () =>
  createSelector(selectHome, homeState => homeState.get('message'));

export {
  selectHome,
  makeSelectUser,
  makeSelectLoading,
  makeSelectDocuments,
  makeSelectCategories,
  makeSelectCollections,
  makeSelectTags,
  makeSelectNews,
  makeSelectFile,
  makeSelectMessage,
};
