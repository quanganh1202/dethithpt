/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import _ from 'lodash';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { getToken } from 'services/auth';
import { GET_DOC_LIST_REQUEST } from './constants';
import {
  getDocumentsListSuccess,
} from './actions';

const root = '/api';

/**
 * Request get document list
 */
export function* getDocumentsListHandler({ id, query }) {
  const url = `${root}/documents`;
  const options = {
    headers: {
      ['x-access-token']: getToken(),
    },
  };

  try {
    const collection = yield call(axios.get, `${root}/collections/${id}`, options);
    const resp = yield call(axios.get, url, { params: query }, options);
    yield put(getDocumentsListSuccess(resp.data, collection.data.data));
  } catch (err) {
    console.log(err.response);
    // yield put(loginFailure(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* homeSaga() {
  yield takeLatest(GET_DOC_LIST_REQUEST, getDocumentsListHandler);
}
