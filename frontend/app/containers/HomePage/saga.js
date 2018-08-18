/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { LOGIN_REQUEST, UPDATE_USER_INFO_REQUEST } from './constants';
import { loginSuccess, loginFailure, updateUserInfoSuccess } from './actions';
import { makeSelectUsername } from 'containers/HomePage/selectors';

/**
 * Request to login using social network token
 */
export function* loginHandler({ payload }) {
  const url = `http://125.212.250.92:3000/login`;

  try {
    // Call our request helper (see 'utils/request')
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
  console.log('update', payload);
  const url = `http://125.212.250.92:3000/register`;

  try {
    // Call our request helper (see 'utils/request')
    const resp = yield call(axios.post, url, payload);
    console.log('resp', resp);
    yield put(updateUserInfoSuccess(resp));
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
}
