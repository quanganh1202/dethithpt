/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import _ from 'lodash';
import { push } from 'react-router-redux';
import { getToken } from 'services/auth';
import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { CREATE_CATEGORY } from './constants';
import {
  createCategorySuccess,
  createCategoryFailure,
} from './actions';

const root = 'http://103.92.29.145:3001/api';

/**
 * Request create category
 */
export function* createCategoryHandler({ data }) {
  const url = `${root}/categories`;
  const options = {
    headers: {
      ['x-access-token']: getToken(),
    }
  }
  try {
    yield call(axios.post, url, data, options);
    yield put(createCategorySuccess());
    yield put(push('/categories'));
  } catch (err) {
    yield put(createCategoryFailure(_.get(err, 'response.data.error', 'Unknown error from server')));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* categoryCreateSaga() {
  yield takeLatest(CREATE_CATEGORY.REQUEST, createCategoryHandler);
}
