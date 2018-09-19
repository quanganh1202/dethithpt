/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import request from 'utils/request';
import {
  LOGIN_REQUEST,
} from './constants';
import {
  loginSuccess,
  loginFailure,
} from './actions';
import { setToken } from 'services/auth';

const root = 'http://103.92.29.145:3001/api';
/**
 * Request to login using social network token
 */
export function* loginHandler({ payload }) {
  const url = `${root}/login`;

  try {
    const resp = yield call(axios.post, url, payload);
    setToken(resp.data.token);
    yield put(loginSuccess(resp.data));
    yield put(push('/'));
  } catch (err) {
    yield put(loginFailure(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* homeSaga() {
  yield takeLatest(LOGIN_REQUEST, loginHandler);
}
