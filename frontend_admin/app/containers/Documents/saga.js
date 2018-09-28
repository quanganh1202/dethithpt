/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import _ from 'lodash';
import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { getToken } from 'services/auth';
import { GET_DOCS, APPROVE_DOCS } from './constants';
import {
  getDocsSuccess,
  approveDocsSuccess,
} from './actions';

const root = '/api';

/**
 * Request get document list
 */
export function* getDocsHandler({ query }) {
  const url = `${root}/documents`;
  const options = {
    params: {
      ...query,
    }
  }

  try {
    const resp = yield call(axios.get, url, options);
    yield put(getDocsSuccess(resp.data));
  } catch (err) {
    // yield put(loginFailure(err));
  }
}

/**
 * Request approve document
 */
export function* approveDocsHandler({ id }) {
  const url = `${root}/documents/${id}/approve`;
  const options = {
    headers: {
      ['x-access-token']: getToken(),
    }
  }

  try {
    yield call(axios.post, url, {}, options);
    yield put(approveDocsSuccess());
  } catch (err) {
    // yield put(loginFailure(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* documentSaga() {
  yield takeLatest(GET_DOCS.REQUEST, getDocsHandler);
  yield takeLatest(APPROVE_DOCS.REQUEST, approveDocsHandler);
}
