/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import _ from 'lodash';
import { push } from 'react-router-redux';
import { getToken } from 'services/auth';
import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { CREATE_SUBJECT } from './constants';
import {
  createSubjectSuccess,
  createSubjectFailure,
} from './actions';

const root = 'http://103.92.29.145:3001/api';

/**
 * Request create class
 */
export function* createSubjectHandler({ data }) {
  const url = `${root}/subjects`;
  const options = {
    headers: {
      ['x-access-token']: getToken(),
    }
  }
  try {
    yield call(axios.post, url, data, options);
    yield put(createSubjectSuccess());
    yield put(push('/subjects'));
  } catch (err) {
  yield put(createSubjectFailure(_.get(err, 'response.data.error', 'Unknown error from server')));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* subjectCreateSaga() {
  yield takeLatest(CREATE_SUBJECT.REQUEST, createSubjectHandler);
}
