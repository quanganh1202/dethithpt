/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import _ from 'lodash';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { getToken } from 'services/auth';
import { GET_CLASSES, DELETE_CLASSES } from './constants';
import {
  getClassesSuccess,
  deleteClassesSuccess,
} from './actions';

const root = '/api';

/**
 * Request get document list
 */
export function* getClassesHandler() {
  const url = `${root}/classes`;

  try {
    const resp = yield call(axios.get, url);
    yield put(getClassesSuccess(resp.data.data));
  } catch (err) {
    // yield put(loginFailure(err));
  }
}

/**
 * Request delete classes
 */
export function* deleteClassesHandler({ ids }) {
  const options = {
    headers: {
      ['x-access-token']: getToken(),
    }
  }

  try {
    yield all(ids.map((i) => {
      const url = `${root}/classes/${i}`;
      return call(axios.delete, url, options);
    }));
    yield put(deleteClassesSuccess());
  } catch (err) {
    console.log(err);
    // yield put(loginFailure(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* classSaga() {
  yield takeLatest(GET_CLASSES.REQUEST, getClassesHandler);
  yield takeLatest(DELETE_CLASSES.REQUEST, deleteClassesHandler);
}
