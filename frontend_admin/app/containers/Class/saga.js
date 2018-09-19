/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import _ from 'lodash';
import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { GET_CLASSES } from './constants';
import {
  getClassesSuccess,
} from './actions';

const root = 'http://103.92.29.145:3001/api';

/**
 * Request get document list
 */
export function* getClassesHandler() {
  const url = `${root}/classes`;

  try {
    const resp = yield call(axios.get, url);
    yield put(getClassesSuccess(resp.data.data));
  } catch (err) {
    // yield put(loginFailure(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* classSaga() {
  yield takeLatest(GET_CLASSES.REQUEST, getClassesHandler);
}
