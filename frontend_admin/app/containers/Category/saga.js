/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import _ from 'lodash';
import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { GET_CATEGORIES_REQUEST } from './constants';
import {
  getCategoriesSuccess,
} from './actions';

const root = 'http://125.212.250.92:3000';

/**
 * Request get document list
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
 * Root saga manages watcher lifecycle
 */
export default function* homeSaga() {
  yield takeLatest(GET_CATEGORIES_REQUEST, getCategoriesHandler);
}
