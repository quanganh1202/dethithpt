/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import _ from 'lodash';
import { push } from 'react-router-redux';
import { getToken } from 'services/auth';
import { call, put, takeLatest } from 'redux-saga/effects';
import { CREATE_NEWS, GET_NEWS } from './constants';
import {
  createNewsSuccess,
  createNewsFailure,
  getNewsSuccess,
} from './actions';

const root = '/api';

/**
 * Request create class
 */
export function* createNewsHandler({ data, module }) {
  const url = `${root}/news`;
  const options = {
    headers: {
      ['x-access-token']: getToken(),
    }
  }
  try {
    yield call(axios.post, url, data, options);
    yield put(createNewsSuccess());
    yield put(push(`/modules/${module}`));
  } catch (err) {
  yield put(createNewsFailure(_.get(err, 'response.data.error', 'Unknown error from server')));
  }
}

/**
 * Request get news list
 */
export function* getNewsHandler({ query }) {
  const url = `${root}/news`;
  const options = {
    params: {
      ...query,
    },
    headers: {
      ['x-access-token']: getToken(),
    },
  };

  try {
    const resp = yield call(axios.get, url, options);
    yield put(getNewsSuccess(resp.data.data));
  } catch (err) {
    // yield put(loginFailure(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* subjectCreateSaga() {
  yield takeLatest(CREATE_NEWS.REQUEST, createNewsHandler);
  yield takeLatest(GET_NEWS.REQUEST, getNewsHandler);
}
