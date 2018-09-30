/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import _ from 'lodash';
import { push } from 'react-router-redux';
import { getToken } from 'services/auth';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { EDIT_DOC, GET_DOC_DETAIL, GET_DATA_INIT } from './constants';
import {
  editDocSuccess,
  editDocFailure,
  getDocDetailSuccess,
  getDataInitSuccess,
} from './actions';

const root = '/api';

/**
 * Request get document detail
 */
export function* getDocHandler({ id }) {
  const url = `${root}/documents/${id}`;
  try {
    const resp = yield call(axios.get, url);
    yield put(getDocDetailSuccess(resp.data.data));
  } catch (err) {
  yield put(editDocFailure(_.get(err, 'response.data.error', 'Unknown error from server')));
  }
}

/**
 * Request edit document
 */
export function* editDocHandler({ data, id }) {
  const url = `${root}/documents/${id}`;
  const options = {
    headers: {
      'content-type': 'multipart/form-data',
      ['x-access-token']: getToken(),
    }
  }
  const formData = new FormData();
  Object.keys(data).forEach((k) => {
    formData.append(k, data[k]);
  })
  try {
    yield call(axios.put, url, formData, options);
    yield put(editDocSuccess());
    yield put(push('/documents'));
  } catch (err) {
  yield put(editDocFailure(_.get(err, 'response.data.error', 'Unknown error from server')));
  }
}

/**
 * Request get data init
 */
export function* getDataInitHandler() {
  try {
    const resp = yield all([
      call(axios.get, `${root}/categories`),
      call(axios.get, `${root}/subjects`),
      call(axios.get, `${root}/classes`),
      call(axios.get, `${root}/collections`),
      call(axios.get, `${root}/tags`),
    ]);
    const categories = _.get(resp, '[0].data.data');
    const subjects = _.get(resp, '[1].data.data');
    const classes = _.get(resp, '[2].data.data');
    const collections = _.get(resp, '[3].data.data');
    const tags = _.get(resp, '[4].data.data');
    yield put(getDataInitSuccess({ categories, subjects, classes, collections, tags }));
  } catch (err) {
  yield put(editDocFailure(_.get(err, 'response.data.error', 'Unknown error from server')));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* docEditSaga() {
  yield takeLatest(GET_DOC_DETAIL.REQUEST, getDocHandler);
  yield takeLatest(EDIT_DOC.REQUEST, editDocHandler);
  yield takeLatest(GET_DATA_INIT.REQUEST, getDataInitHandler);
}
