/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import _ from 'lodash';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { getToken } from 'services/auth';
import { GET_SUBJECTS, DELETE_SUBJECTS, UPDATE_SUBJECTS } from './constants';
import {
  getSubjectsSuccess,
  deleteSubjectsSuccess,
  updateSubjectsSuccess,
} from './actions';

const root = '/api';

/**
 * Request get document list
 */
export function* getSubjectsHandler() {
  const url = `${root}/subjects`;

  try {
    const resp = yield call(axios.get, url);
    yield put(getSubjectsSuccess(resp.data.data));
  } catch (err) {
    // yield put(loginFailure(err));
  }
}

/**
 * Request delete subjects
 */
export function* deleteSubjectsHandler({ ids }) {
  const options = {
    headers: {
      ['x-access-token']: getToken(),
    }
  }

  try {
    yield all(ids.map((i) => {
      const url = `${root}/subjects/${i}`;
      return call(axios.delete, url, options);
    }));
    yield put(deleteSubjectsSuccess());
  } catch (err) {
    console.log(err);
    // yield put(loginFailure(err));
  }
}

/**
 * Request update subjects
 */
export function* updateSubjectsHandler({ subjects }) {
  const options = {
    headers: {
      ['x-access-token']: getToken(),
    }
  }

  try {
    yield all(subjects.map((i) => {
      const item = { ...i };
      const url = `${root}/subjects/${item.id}`;
      delete item.id;
      return call(axios.put, url, item, options);
    }));
    yield put(updateSubjectsSuccess());
  } catch (err) {
    console.log(err);
    // yield put(loginFailure(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* subjectSaga() {
  yield takeLatest(GET_SUBJECTS.REQUEST, getSubjectsHandler);
  yield takeLatest(DELETE_SUBJECTS.REQUEST, deleteSubjectsHandler);
  yield takeLatest(UPDATE_SUBJECTS.REQUEST, updateSubjectsHandler);
}
