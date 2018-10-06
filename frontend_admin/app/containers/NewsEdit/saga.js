/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import _ from 'lodash';
import { push } from 'react-router-redux';
import { getToken } from 'services/auth';
import { call, put, takeLatest } from 'redux-saga/effects';
import { UPDATE_NEWS, GET_NEWS_DETAIL } from './constants';
import {
  updateNewsSuccess,
  updateNewsFailure,
  getNewsDetailSuccess,
  getNewsDetailFailure,
} from './actions';

const root = '/api';

/**
 * Request create class
 */
export function* updateNewsHandler({ id, data, module }) {
  const url = `${root}/news/${id}`;
  const options = {
    headers: {
      ['x-access-token']: getToken(),
    }
  }
  try {
    yield call(axios.put, url, data, options);
    yield put(updateNewsSuccess());
    yield put(push(`/modules/${module}`));
  } catch (err) {
    yield put(updateNewsFailure(_.get(err, 'response.data.error', 'Unknown error from server')));
  }
}

/**
 * Request get news detail
 */
export function* getNewsDetailtHandler({ id }) {
  const url = `${root}/news?id=${id}`;
  const options = {
    headers: {
      ['x-access-token']: getToken(),
    }
  }
  try {
    const resp = yield call(axios.get, url, options);
    yield put(getNewsDetailSuccess(resp.data.data.find((i) => i.id === id)));
  } catch (err) {
    yield put(getNewsDetailFailure(_.get(err, 'response.data.error', 'Unknown error from server')));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* subjectCreateSaga() {
  yield takeLatest(UPDATE_NEWS.REQUEST, updateNewsHandler);
  yield takeLatest(GET_NEWS_DETAIL.REQUEST, getNewsDetailtHandler);
}
