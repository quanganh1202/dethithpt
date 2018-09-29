/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import _ from 'lodash';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { getToken } from 'services/auth';
import { GET_DOCS, APPROVE_DOCS, DELETE_DOC, UPDATE_DOCS, GET_DATA_INIT } from './constants';
import {
  getDocsSuccess,
  approveDocsSuccess,
  deleteDocSuccess,
  updateDocsSuccess,
  getDataInitSuccess,
} from './actions';

const root = '/api';

/**
 * Request get document list
 */
export function* getDocsHandler({ query }) {
  const url = `${root}/documents?approved=all`;
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
export function* approveDocsHandler({ ids }) {
  const options = {
    headers: {
      ['x-access-token']: getToken(),
    }
  }

  try {
    yield all(ids.map((i) => {
      const url = `${root}/documents/${i}/approve`;
      return call(axios.post, url, {}, options);
    }));
    yield put(approveDocsSuccess());
  } catch (err) {
    // yield put(loginFailure(err));
  }
}

/**
 * Request delete document
 */
export function* deleteDocHandler({ ids }) {
  const options = {
    headers: {
      ['x-access-token']: getToken(),
    }
  }

  try {
    yield all(ids.map((i) => {
      const url = `${root}/documents/${i}`;
      return call(axios.delete, url, options);
    }));
    yield put(deleteDocSuccess());
  } catch (err) {
    // yield put(loginFailure(err));
  }
}

/**
 * Request update documents
 */
export function* updateDocsHandler({ ids, data }) {
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
    yield all(ids.map((i) => {
      const url = `${root}/documents/${i}`;
      return call(axios.put, url, formData, options);
    }));
    yield put(updateDocsSuccess());
  } catch (err) {
    // yield put(loginFailure(err));
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
    ]);
    const categories = _.get(resp, '[0].data.data');
    const subjects = _.get(resp, '[1].data.data');
    const classes = _.get(resp, '[2].data.data');
    const collections = _.get(resp, '[3].data.data');
    yield put(getDataInitSuccess({ categories, subjects, classes, collections }));
  } catch (err) {
  yield put(editDocFailure(_.get(err, 'response.data.error', 'Unknown error from server')));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* documentSaga() {
  yield takeLatest(GET_DOCS.REQUEST, getDocsHandler);
  yield takeLatest(APPROVE_DOCS.REQUEST, approveDocsHandler);
  yield takeLatest(DELETE_DOC.REQUEST, deleteDocHandler);
  yield takeLatest(UPDATE_DOCS.REQUEST, updateDocsHandler);
  yield takeLatest(GET_DATA_INIT.REQUEST, getDataInitHandler);
}