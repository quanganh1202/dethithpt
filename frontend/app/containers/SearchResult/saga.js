/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import _ from 'lodash';
import { call, put, takeLatest } from 'redux-saga/effects';
import { GET_DOC_DETAILS_REQUEST, GET_DOC_LIST_REQUEST } from './constants';
import { getDocumentDetailsSuccess, getDocumentsListSuccess } from './actions';

const root = '/api';

/**
 * Request get document list
 */
export function* getDocumentsListHandler({ query }) {
  const url = `${root}/documents`;

  try {
    const resp = yield call(axios.get, url, { params: query });
    yield put(getDocumentsListSuccess(resp.data));
  } catch (err) {
    // yield put(loginFailure(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* homeSaga() {
  yield takeLatest(GET_DOC_LIST_REQUEST, getDocumentsListHandler);
}
