/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import _ from 'lodash';
import { push } from 'react-router-redux';
import { getToken } from 'services/auth';
import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { CREATE_CLASS } from './constants';
import {
  createClassSuccess,
  createClassFailure,
} from './actions';

const root = 'http://103.92.29.145:3001/api';

/**
 * Request create class
 */
export function* createClassHandler({ data }) {
  const url = `${root}/classes`;
  const options = {
    headers: {
      ['x-access-token']: getToken(),
    }
  }
  try {
    yield call(axios.post, url, data, options);
    yield put(createClassSuccess());
    yield put(push('/classes'));
  } catch (err) {
  yield put(createClassFailure(_.get(err, 'response.data.error', 'Unknown error from server')));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* classCreateSaga() {
  yield takeLatest(CREATE_CLASS.REQUEST, createClassHandler);
}
