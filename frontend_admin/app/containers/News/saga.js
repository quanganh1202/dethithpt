/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import _ from 'lodash';
import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { GET_NEWS } from './constants';
import {
  getNewsSuccess,
} from './actions';

const root = '/api';

/**
 * Request get news list
 */
export function* getNewsHandler() {
  const url = `${root}/news`;

  try {
    const resp = yield call(axios.get, url);
    yield put(getNewsSuccess(resp.data.data));
  } catch (err) {
    // yield put(loginFailure(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* newsSaga() {
  yield takeLatest(GET_NEWS.REQUEST, getNewsHandler);
}
