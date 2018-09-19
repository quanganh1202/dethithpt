/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import _ from 'lodash';
import { push } from 'react-router-redux';
import { getToken } from 'services/auth';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { CREATE_COLLECTION, GET_INIT_DATA } from './constants';
import {
  createCollectionSuccess,
  createCollectionFailure,
  getInitDataSuccess,
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
 * Request get init data
 */
export function* getInitDataHandler() {
  try {
    const resp = yield all([
      call(axios.get, `${root}/categories`),
      call(axios.get, `${root}/subjects`),
      call(axios.get, `${root}/classes`),
    ]);
    const categories = _.get(resp, '[0].data.data');
    const subjects = _.get(resp, '[1].data.data');
    const classes = _.get(resp, '[2].data.data');
    yield put(getInitDataSuccess({ categories, subjects, classes }));
  } catch (err) {
    console.log(err)
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* collectionCreateSaga() {
  yield takeLatest(CREATE_COLLECTION.REQUEST, createCollectionHandler);
  yield takeLatest(GET_INIT_DATA.REQUEST, getInitDataHandler);
}
