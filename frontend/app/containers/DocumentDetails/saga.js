/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import _ from 'lodash';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { GET_DOC_DETAILS_REQUEST, GET_DOC_LIST_REQUEST } from './constants';
import {
  getDocumentDetailsSuccess,
  getDocumentsListSuccess,
} from './actions';
import { makeSelectUsername } from 'containers/HomePage/selectors';

/**
 * Request to get document details by id
 */
export function* getDocumentDetailsHandler({ id }) {
  const url = `http://125.212.250.92:3000/documents/${id}`;

  try {
    const resp = yield call(axios.get, url);
    yield put(getDocumentDetailsSuccess(_.get(resp.data, 'data[0]')));
  } catch (err) {
    console.log(err.message);
    // yield put(loginFailure(err));
  }
}

/**
 * Request get document list
 */
export function* getDocumentsListHandler({ query }) {
  const url = `http://125.212.250.92:3000/documents`;

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
  yield takeLatest(GET_DOC_DETAILS_REQUEST, getDocumentDetailsHandler);
  yield takeLatest(GET_DOC_LIST_REQUEST, getDocumentsListHandler)
}
