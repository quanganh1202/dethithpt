/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import _ from 'lodash';
import { push } from 'react-router-redux';
import { getToken } from 'services/auth';
import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { CREATE_NEWS } from './constants';
import {
  createNewsSuccess,
  createNewsFailure,
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
 * Root saga manages watcher lifecycle
 */
export default function* subjectCreateSaga() {
  yield takeLatest(CREATE_NEWS.REQUEST, createNewsHandler);
}
