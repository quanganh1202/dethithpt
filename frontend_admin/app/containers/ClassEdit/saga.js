/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import _ from 'lodash';
import { getToken } from 'services/auth';
import { push } from 'react-router-redux';
import { call, put, takeLatest } from 'redux-saga/effects';
import { UPDATE_CLASS, GET_CLASS_DETAIL } from './constants';
import {
  updateClassSuccess,
  updateClassFailure,
  getClassDetailFailure,
  getClassDetailSuccess,
} from './actions';

const root = '/api';

/**
 * Request get detail class
 */
export function* getDetailClassHandler({ id }) {
  const url = `${root}/classes/${id}`;
  const options = {
    headers: {
      'x-access-token': getToken(),
    },
  };
  try {
    const classDetail = yield call(axios.get, url, options);
    yield put(getClassDetailSuccess(classDetail.data.data));
  } catch (err) {
    yield put(
      getClassDetailFailure(
        _.get(err, 'response.data.error', 'Unknown error from server'),
      ),
    );
  }
}

/**
 * Request update class
 */
export function* updateClassHandler({ data, id }) {
  const url = `${root}/classes/${id}`;
  const options = {
    headers: {
      'x-access-token': getToken(),
    },
  };
  try {
    yield call(axios.put, url, data, options);
    yield put(updateClassSuccess());
    yield put(push('/classes'));
    // yield getDetailClassHandler({ id });
  } catch (err) {
    yield put(
      updateClassFailure(
        _.get(err, 'response.data.error', 'Unknown error from server'),
      ),
    );
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* classEditSaga() {
  yield takeLatest(UPDATE_CLASS.REQUEST, updateClassHandler);
  yield takeLatest(GET_CLASS_DETAIL.REQUEST, getDetailClassHandler);
}
