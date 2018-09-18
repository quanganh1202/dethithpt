/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import _ from 'lodash';
import { push } from 'react-router-redux';
import { getToken } from 'services/auth';
import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { CREATE_COLLECTION } from './constants';
import {
  createCollectionSuccess,
  createCollectionFailure,
} from './actions';

const root = 'http://103.92.29.145:3001/api';

/**
 * Request create category
 */
export function* createCollectionHandler({ data }) {
  const url = `${root}/collections`;
  const options = {
    headers: {
      ['x-access-token']: getToken(),
    }
  }
  try {
    yield call(axios.post, url, data, options);
    yield put(createCollectionSuccess());
    yield put(push('/collections'));
  } catch (err) {
    yield put(createCollectionFailure(_.get(err, 'response.data.error', 'Unknown error from server')));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* collectionCreateSaga() {
  yield takeLatest(CREATE_COLLECTION.REQUEST, createCollectionHandler);
}
