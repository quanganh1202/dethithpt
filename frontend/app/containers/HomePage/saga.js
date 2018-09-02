/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { LOGIN_REQUEST, UPDATE_USER_INFO_REQUEST, GET_DOC_LIST_REQUEST } from './constants';
import {
  loginSuccess,
  loginFailure,
  updateUserInfoSuccess,
  getDocumentsListSuccess,
} from './actions';
import { makeSelectUsername } from 'containers/HomePage/selectors';

/**
 * Request to login using social network token
 */
export function* loginHandler({ payload }) {
  const url = `/api/login`;

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
  const url = `/api/register`;

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
  const url = `/api/documents`;

  try {
    const resp = yield call(axios.get, url, { params: query });
    yield put(getDocumentsListSuccess(resp.data));
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
  yield takeLatest(GET_DOC_LIST_REQUEST, getDocumentsListHandler)
}
