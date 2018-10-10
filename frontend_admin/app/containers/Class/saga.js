/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import _ from 'lodash';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { getToken } from 'services/auth';
import { GET_CLASSES, DELETE_CLASSES, UPDATE_CLASSES } from './constants';
import {
  getClassesSuccess,
  deleteClassesSuccess,
  updateClassesSuccess,
} from './actions';

const root = '/api';

/**
 * Request get document list
 */
export function* getClassesHandler({ queries }) {
  const url = `${root}/classes`;
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
    yield put(getClassesSuccess(resp.data.data, resp.data.total));
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
 * Request update classes
 */
export function* updateClassesHandler({ classes }) {
  const options = {
    headers: {
      ['x-access-token']: getToken(),
    }
  }

  try {
    yield all(classes.map((i) => {
      const item = { ...i };
      const url = `${root}/classes/${item.id}`;
      delete item.id;
      return call(axios.put, url, item, options);
    }));
    yield put(updateClassesSuccess());
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
  yield takeLatest(UPDATE_CLASSES.REQUEST, updateClassesHandler);
}
