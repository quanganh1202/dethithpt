/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import _ from 'lodash';
import { push } from 'react-router-redux';
import { getToken } from 'services/auth';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import {
  GET_COLLECTION_DETAIL,
  UPDATE_COLLECTION,
  GET_INIT_DATA,
} from './constants';
import {
  updateCollectionSuccess,
  updateCollectionFailure,
  getInitDataSuccess,
  getCollectionDetailSuccess,
} from './actions';

const root = '/api';

/**
 * Request create category
 */
export function* updateCollectionHandler({ id, data }) {
  const url = `${root}/collections/${id}`;
  const options = {
    headers: {
      'x-access-token': getToken(),
    },
  };
  try {
    yield call(axios.put, url, data, options);
    yield put(updateCollectionSuccess());
    yield put(push('/collections'));
  } catch (err) {
    yield put(
      updateCollectionFailure(
        _.get(err, 'response.data.error', 'Unknown error from server'),
      ),
    );
  }
}

/**
 * Request get init data
 */
export function* getInitDataHandler() {
  try {
    const resp = yield all([
      call(axios.get, `${root}/categories?size=10000&sort=position.asc`),
      call(axios.get, `${root}/subjects?size=10000&sort=position.asc`),
      call(axios.get, `${root}/classes?size=10000&sort=position.asc`),
    ]);
    const categories = _.get(resp, '[0].data.data');
    const subjects = _.get(resp, '[1].data.data');
    const classes = _.get(resp, '[2].data.data');
    yield put(getInitDataSuccess({ categories, subjects, classes }));
  } catch (err) {
    console.log(err);
  }
}

/**
 * Request get detail collection
 */
export function* getCollectionHandler({ id }) {
  const url = `${root}/collections/${id}`;
  const options = {
    headers: {
      'x-access-token': getToken(),
    },
  };
  try {
    const res = yield call(axios.get, url, options);
    yield put(getCollectionDetailSuccess(res.data.data));
  } catch (err) {
    // yield put(
    //   getClassDetailFailure(
    //     _.get(err, 'response.data.error', 'Unknown error from server'),
    //   ),
    // );
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* collectionCreateSaga() {
  yield takeLatest(UPDATE_COLLECTION.REQUEST, updateCollectionHandler);
  yield takeLatest(GET_COLLECTION_DETAIL.REQUEST, getCollectionHandler);
  yield takeLatest(GET_INIT_DATA.REQUEST, getInitDataHandler);
}
