/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import _ from 'lodash';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { getToken } from 'services/auth';
import { GET_COLLECTIONS, DELETE_COLLECTIONS } from './constants';
import {
  getCollectionsSuccess,
  deleteCollectionsSuccess,
} from './actions';

const root = '/api';

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
 * Request delete classes
 */
export function* deleteCollectionsHandler({ ids }) {
  const options = {
    headers: {
      ['x-access-token']: getToken(),
    }
  }

  try {
    yield all(ids.map((i) => {
      const url = `${root}/collections/${i}`;
      return call(axios.delete, url, options);
    }));
    yield put(deleteCollectionsSuccess());
  } catch (err) {
    console.log(err);
    // yield put(loginFailure(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* collectionSaga() {
  yield takeLatest(GET_COLLECTIONS.REQUEST, getCollectionsHandler);
  yield takeLatest(DELETE_COLLECTIONS.REQUEST, deleteCollectionsHandler);
}
