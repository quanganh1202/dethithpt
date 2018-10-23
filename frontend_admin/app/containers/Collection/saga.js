/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import _ from 'lodash';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { getToken } from 'services/auth';
import { GET_COLLECTIONS, DELETE_COLLECTIONS, UPDATE_COLLECTIONS, GET_DATA_INIT } from './constants';
import {
  getCollectionsSuccess,
  deleteCollectionsSuccess,
  updateCollectionsSuccess,
  getDataInitSuccess
} from './actions';

const root = '/api';

/**
 * Request get document list
 */
export function* getCollectionsHandler({ queries }) {
  const url = `${root}/collections`;
  const options = {
    headers: {
      ['x-access-token']: getToken(),
    },
    params: {
      ...queries,
    }
  }

  try {
    const resp = yield call(axios.get, url, options);
    yield put(getCollectionsSuccess(resp.data.data, resp.data.total));
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
 * Request update collections
 */
export function* updateCollectionsHandler({ collections }) {
  const options = {
    headers: {
      ['x-access-token']: getToken(),
    }
  }

  try {
    yield all(collections.map((i) => {
      const item = { ...i };
      const url = `${root}/collections/${item.id}`;
      delete item.id;
      return call(axios.put, url, item, options);
    }));
    yield put(updateCollectionsSuccess());
  } catch (err) {
    console.log(err);
    // yield put(loginFailure(err));
  }
}

/**
 * Request get data init
 */
export function* getDataInitHandler() {
  try {
    const resp = yield all([
      call(axios.get, `${root}/categories?size=10000&sort=position.asc`),
      call(axios.get, `${root}/subjects?size=10000&sort=position.asc`),
      call(axios.get, `${root}/classes?size=10000&sort=position.asc`),
    ]);
    const categories = _.get(resp, '[0].data.data');
    const subjects = _.get(resp, '[1].data.data');
    const classes = _.get(resp, '[2].data.data');
    yield put(getDataInitSuccess({ categories, subjects, classes }));
  } catch (err) {
  yield put(editDocFailure(_.get(err, 'response.data.error', 'Unknown error from server')));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* collectionSaga() {
  yield takeLatest(GET_COLLECTIONS.REQUEST, getCollectionsHandler);
  yield takeLatest(DELETE_COLLECTIONS.REQUEST, deleteCollectionsHandler);
  yield takeLatest(UPDATE_COLLECTIONS.REQUEST, updateCollectionsHandler);
  yield takeLatest(GET_DATA_INIT.REQUEST, getDataInitHandler);
}
