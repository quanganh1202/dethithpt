/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import _ from 'lodash';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { GET_FILTER_DATA_REQUEST, GET_DOC_LIST_REQUEST } from './constants';
import {
  getFilterDataSuccess,
  getDocumentsListSuccess,
} from './actions';
import { makeSelectUsername } from 'containers/HomePage/selectors';

const root = '/api';

/**
 * Request to get document details by id
 */
export function* getFilterDataHandler() {
  try {
    const resp = yield all([
      call(axios.get, `${root}/subjects`),
      call(axios.get, `${root}/classes`),
    ]);
    const subjects = _.get(resp, '[0].data.data');
    const classes = _.get(resp, '[1].data.data');
    yield put(getFilterDataSuccess({ subjects, classes }));
  } catch (err) {
    console.log(err.message);
    // yield put(loginFailure(err));
  }
}

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
  yield takeLatest(GET_FILTER_DATA_REQUEST, getFilterDataHandler);
  yield takeLatest(GET_DOC_LIST_REQUEST, getDocumentsListHandler)
}
