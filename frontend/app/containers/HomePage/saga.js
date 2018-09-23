/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import {
  LOGIN_REQUEST,
  UPDATE_USER_INFO_REQUEST,
  GET_DOC_LIST_REQUEST,
  GET_CATE_LIST_REQUEST,
  GET_COLLECTION_LIST_REQUEST,
  GET_TAGS_REQUEST,
} from './constants';
import {
  loginSuccess,
  loginFailure,
  updateUserInfoSuccess,
  getDocumentsListSuccess,
  getCategoriesSuccess,
  getCollectionsSuccess,
  getTagsSuccess,
} from './actions';

const root = '/api';
/**
 * Request to login using social network token
 */
export function* loginHandler({ payload }) {
  const url = `${root}/login`;

  try {
    const resp = yield call(axios.post, url, payload);
    yield put(loginSuccess(resp.data));
  } catch (err) {
    yield put(loginFailure(err));
  }
}

/**
 * Request update user info
 */
export function* updateUserHandler({ payload }) {
  const url = `${root}/register`;

  try {
    const resp = yield call(axios.post, url, payload);
    yield put(updateUserInfoSuccess(resp.data));
  } catch (err) {
    // yield put(loginFailure(err));
  }
}

/**
 * Request get document list
 */
export function* getDocumentsListHandler({ query }) {
  const url = `${root}/documents`;

  try {
    const resp = yield call(axios.get, url, { params: query });
    yield put(getDocumentsListSuccess(resp.data));
  } catch (err) {
    // yield put(loginFailure(err));
  }
}

/**
 * Request get categories list
 */
export function* getCategoriesHandler() {
  const url = `${root}/categories`;

  try {
    const resp = yield call(axios.get, url);
    yield put(getCategoriesSuccess(resp.data.data));
  } catch (err) {
    // yield put(loginFailure(err));
  }
}

/**
 * Request get collections list
 */
export function* getCollectionsHandler() {
  const url = `${root}/collections`;

  try {
    const resp = yield call(axios.get, url);
    yield put(getCollectionsSuccess(resp.data.data));
  } catch (err) {
    // yield put(loginFailure(err));
  }
}

/**
 * Request get tags list
 */
export function* getTagsHandler() {
  const url = `${root}/tags`;

  try {
    const resp = yield call(axios.get, url);
    yield put(getTagsSuccess(resp.data.data));
  } catch (err) {
    // yield put(loginFailure(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* homeSaga() {
  yield takeLatest(LOGIN_REQUEST, loginHandler);
  yield takeLatest(UPDATE_USER_INFO_REQUEST, updateUserHandler);
  yield takeLatest(GET_DOC_LIST_REQUEST, getDocumentsListHandler);
  yield takeLatest(GET_CATE_LIST_REQUEST, getCategoriesHandler);
  yield takeLatest(GET_COLLECTION_LIST_REQUEST, getCollectionsHandler);
  yield takeLatest(GET_TAGS_REQUEST, getTagsHandler);
}
