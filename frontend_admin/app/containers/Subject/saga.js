/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import _ from 'lodash';
import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { GET_SUBJECTS } from './constants';
import {
  getSubjectsSuccess,
} from './actions';

const root = '/api';

/**
 * Request get document list
 */
export function* getSubjectsHandler() {
  const url = `${root}/subjects`;

  try {
    const resp = yield call(axios.get, url);
    yield put(getSubjectsSuccess(resp.data.data));
  } catch (err) {
    // yield put(loginFailure(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* subjectSaga() {
  yield takeLatest(GET_SUBJECTS.REQUEST, getSubjectsHandler);
}
