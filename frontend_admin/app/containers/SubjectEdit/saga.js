/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import _ from 'lodash';
import { push } from 'react-router-redux';
import { getToken } from 'services/auth';
import { call, put, takeLatest } from 'redux-saga/effects';
import { UPDATE_SUBJECT, GET_SUBJECT_DETAIL } from './constants';
import {
  updateSubjectSuccess,
  updateSubjectFailure,
  getSubjectDetailSuccess,
  getSubjectDetailFailure,
} from './actions';

const root = '/api';

/**
 * Request get detail subject
 */
export function* getDetailSubjectHandler({ id }) {
  const url = `${root}/subjects/${id}`;
  const options = {
    headers: {
      'x-access-token': getToken(),
    },
  };
  try {
    const subjectDetail = yield call(axios.get, url, options);
    yield put(getSubjectDetailSuccess(subjectDetail.data.data));
  } catch (err) {
    yield put(
      getSubjectDetailFailure(
        _.get(err, 'response.data.error', 'Unknown error from server'),
      ),
    );
  }
}

/**
 * Request update subject
 */
export function* updateSubjectHandler({ data, id }) {
  const url = `${root}/subjects/${id}`;
  const options = {
    headers: {
      'x-access-token': getToken(),
    },
  };
  try {
    yield call(axios.put, url, data, options);
    yield put(updateSubjectSuccess());
    yield put(push('/subjects'));
    // yield getDetailSubjectHandler({ id });
  } catch (err) {
    yield put(
      updateSubjectFailure(
        _.get(err, 'response.data.error', 'Unknown error from server'),
      ),
    );
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* subjectEditSaga() {
  yield takeLatest(UPDATE_SUBJECT.REQUEST, updateSubjectHandler);
  yield takeLatest(GET_SUBJECT_DETAIL.REQUEST, getDetailSubjectHandler);
}
