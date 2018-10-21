/*
 * HomeConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */
import { defineAction } from 'redux-define';
const container = 'thpt/Home';

export const LOGIN_REQUEST = 'thpt/Home/LOGIN/REQUEST';
export const LOGIN_SUCCESS = 'thpt/Home/LOGIN/SUCCESS';
export const LOGIN_FAILURE = 'thpt/Home/LOGIN/FAILURE';
export const UPDATE_USER_INFO_REQUEST = 'thpt/Home/UPDATE_USER_INFO/REQUEST';
export const UPDATE_USER_INFO_SUCCESS = 'thpt/Home/UPDATE_USER_INFO/SUCCESS';
export const UPDATE_USER_INFO_FAILURE = 'thpt/Home/UPDATE_USER_INFO/FAILURE';
export const GET_DOC_LIST_REQUEST = 'thpt/Home/GET_DOC_LIST/REQUEST';
export const GET_DOC_LIST_SUCCESS = 'thpt/Home/GET_DOC_LIST/SUCCESS';
export const GET_CATE_LIST_REQUEST = 'thpt/Home/GET_CATE_LIST/REQUEST';
export const GET_CATE_LIST_SUCCESS = 'thpt/Home/GET_CATE_LIST/SUCCESS';
export const GET_COLLECTION_LIST_REQUEST =
  'thpt/Home/GET_COLLECTION_LIST/REQUEST';
export const GET_COLLECTION_LIST_SUCCESS =
  'thpt/Home/GET_COLLECTION_LIST/SUCCESS';
export const GET_TAGS_REQUEST = 'thpt/Home/GET_TAGS/REQUEST';
export const GET_TAGS_SUCCESS = 'thpt/Home/GET_TAGS/SUCCESS';
export const REQUEST_DOWNLOAD = defineAction(
  'REQUEST_DOWNLOAD',
  ['REQUEST', 'SUCCESS', 'FAILURE'],
  container,
);
export const REQUEST_PURCHASE = defineAction(
  'REQUEST_PURCHASE',
  ['REQUEST', 'SUCCESS', 'FAILURE'],
  container,
);
export const REMOVE_FILE_SAVE = defineAction('REMOVE_FILE_SAVE', container);
export const REMOVE_MESSAGE = defineAction('REMOVE_MESSAGE', container);
export const CLOSE_POPUP_COLLECTION = defineAction('CLOSE_POPUP_COLLECTION', container);
export const GET_PREVIEW = defineAction(
  'GET_PREVIEW',
  ['REQUEST', 'SUCCESS', 'FAILURE'],
  container,
);
export const GET_NEWS = defineAction(
  'GET_NEWS',
  ['REQUEST', 'SUCCESS', 'FAILURE'],
  container,
);
export const GET_GENERAL_INFO = defineAction(
  'GET_GENERAL_INFO',
  ['REQUEST', 'SUCCESS', 'FAILURE'],
  container,
);
export const QUERY_DATA = 'thpt/Home/HOMEPAGE/QUERY';
export const PREVIEW_DOC = 'thpt/Home/HOMEPAGE/PREVIEW_DOC';
export const PREVIEW_CLOSE = 'thpt/Home/HOMEPAGE/PREVIEW_CLOSE';
