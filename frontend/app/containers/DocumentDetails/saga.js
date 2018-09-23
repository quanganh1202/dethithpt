/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import _ from 'lodash';
import { call, put, takeLatest } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { getToken } from 'services/auth';
import request from 'utils/request';
import {
  GET_DOC_DETAILS_REQUEST,
  GET_DOC_LIST_REQUEST,
  REQUEST_DOWNLOAD,
  REQUEST_PURCHASE,
} from './constants';
import {
  getDocumentDetailsSuccess,
  getDocumentsListSuccess,
  requestDownloadSuccess,
  requestDownloadFailure,
  requestPurchase,
  requestPurchaseFailure,
} from './actions';

const root = '/api';

/**
 * Request to get document details by id
 */
export function* getDocumentDetailsHandler({ id }) {
  const url = `${root}/documents/${id}`;

  try {
    const resp = yield call(axios.get, url);
    yield put(getDocumentDetailsSuccess(_.get(resp.data, 'data')));
  } catch (err) {
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
 * Request download document
 */
export function* requestDownloadHandler({ id }) {
  const url = `${root}/download/${id}`;
  const options = {
    headers: {
      ['x-access-token']: getToken(),
      ['Content-Type']: 'application/pdf',
    },
  }

  try {
    yield call(axios.post, url, {}, options);
    const resp = yield call(axios.post, `${url}?download`, {}, { ...options, responseType: 'blob' });
    yield put(requestDownloadSuccess(resp.data));
  } catch (err) {
    const errorMessage = _.get(err, 'response.data.error', 'Unknown server error');
    if (errorMessage.includes('You have not purchased document')) {
      yield put(requestPurchase(id, true));
    } else {
      yield put(requestDownloadFailure('unknown_error_download'));
    }
  }
}

export function* purchaseDocumentHandler({ id, download }) {
  const url = `${root}/documents/${id}/purchase`;
  const options = {
    headers: {
      ['x-access-token']: getToken(),
    }
  }

  try {
    yield call(axios.post, url, {}, options);
    if (download) {
      const downloadUrl = `${root}/download/${id}?download`
      const downloadRes = yield call(axios.post, downloadUrl, {}, { ...options, responseType: 'blob', });
      yield put(requestDownloadSuccess(downloadRes.data));
    }
  } catch (err) {
    if (_.get(err, 'response.data.error', 'Unknown server error') === 'Not enough money') {
      yield put(requestPurchaseFailure('not_enough_money'));
    } else {
      yield put(requestDownloadFailure('unknown_error_download'));
    }
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* documentDetailsSaga() {
  yield takeLatest(GET_DOC_DETAILS_REQUEST, getDocumentDetailsHandler);
  yield takeLatest(GET_DOC_LIST_REQUEST, getDocumentsListHandler);
  yield takeLatest(REQUEST_DOWNLOAD.REQUEST, requestDownloadHandler);
  yield takeLatest(REQUEST_PURCHASE.REQUEST, purchaseDocumentHandler);
}
