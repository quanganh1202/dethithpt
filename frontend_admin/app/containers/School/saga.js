/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import _ from 'lodash';
import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { GET_SCHOOLS } from './constants';
import {
  getSchoolsSuccess,
} from './actions';

const root = 'http://103.92.29.145:3001/api';

/**
 * Request get document list
 */
export function* getSchoolsHandler() {
  const url = `${root}/schools`;

  try {
    const resp = yield call(axios.get, url);
    yield put(getSchoolsSuccess(resp.data.data));
  } catch (err) {
    // yield put(loginFailure(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* schoolSaga() {
  yield takeLatest(GET_SCHOOLS.REQUEST, getSchoolsHandler);
}
