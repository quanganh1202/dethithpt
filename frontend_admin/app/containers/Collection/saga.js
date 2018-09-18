/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import _ from 'lodash';
import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { GET_COLLECTIONS } from './constants';
import {
  getCollectionsSuccess,
} from './actions';

const root = 'http://103.92.29.145:3000/api';

/**
 * Request get document list
 */
export function* getCollectionsHandler() {
  const url = `${root}/collections`;

  try {
    const resp = yield call(axios.get, url);
    yield put(getCollectionsSuccess(resp.data.data));
  } catch (err) {
    // yield put(loginFailure(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* collectionSaga() {
  yield takeLatest(GET_COLLECTIONS.REQUEST, getCollectionsHandler);
}
