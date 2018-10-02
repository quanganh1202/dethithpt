/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import _ from 'lodash';
import { call, put, takeLatest } from 'redux-saga/effects';
import {
  GET_NEWS_DETAILS,
} from './constants';
import {
  getNewsDetailsSuccess,
} from './actions';

const root = '/api';

/**
 * Request to get document details by id
 */
export function* getNewsDetailsHandler({ id }) {
  const url = `${root}/news`;

  try {
    const resp = yield call(axios.get, url);
    console.log(id);
    const newData = _.get(resp.data, 'data', []).find((i) => i.id === id);
    yield put(getNewsDetailsSuccess(newData));
  } catch (err) {
    // yield put(loginFailure(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* documentDetailsSaga() {
  yield takeLatest(GET_NEWS_DETAILS.REQUEST, getNewsDetailsHandler);
}
