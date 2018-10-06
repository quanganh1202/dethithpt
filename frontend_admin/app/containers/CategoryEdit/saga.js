/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import _ from 'lodash';
import { getToken } from 'services/auth';
import { push } from 'react-router-redux';
import { call, put, takeLatest } from 'redux-saga/effects';
import { UPDATE_CATEGORY, GET_CATEGORY_DETAIL } from './constants';
import {
  updateCategorySuccess,
  updateCategoryFailure,
  getCategoryDetailFailure,
  getCategoryDetailSuccess,
} from './actions';

const root = '/api';

/**
 * Request get detail category
 */
export function* getDetailCategoryHandler({ id }) {
  const url = `${root}/categories/${id}`;
  const options = {
    headers: {
      'x-access-token': getToken(),
    },
  };
  try {
    const categoryDetail = yield call(axios.get, url, options);
    yield put(getCategoryDetailSuccess(categoryDetail.data.data));
  } catch (err) {
    yield put(
      getCategoryDetailFailure(
        _.get(err, 'response.data.error', 'Unknown error from server'),
      ),
    );
  }
}

/**
 * Request update category
 */
export function* updateCategoryHandler({ data, id }) {
  const url = `${root}/categories/${id}`;
  const options = {
    headers: {
      'x-access-token': getToken(),
    },
  };
  try {
    yield call(axios.put, url, data, options);
    yield put(updateCategorySuccess());
    yield put(push('/categories'));
    // yield getDetailCategoryHandler({ id });
  } catch (err) {
    yield put(
      updateCategoryFailure(
        _.get(err, 'response.data.error', 'Unknown error from server'),
      ),
    );
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* categoryEditSaga() {
  yield takeLatest(UPDATE_CATEGORY.REQUEST, updateCategoryHandler);
  yield takeLatest(GET_CATEGORY_DETAIL.REQUEST, getDetailCategoryHandler);
}
