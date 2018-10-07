/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import _ from 'lodash';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { getToken } from 'services/auth';
import { GET_NEWS, DELETE_NEWS } from './constants';
import {
  getNewsSuccess,
  deleteNewsSuccess,
} from './actions';

const root = '/api';

/**
 * Request get news list
 */
export function* getNewsHandler({ query }) {
  const url = `${root}/news`;
  const options = {
    params: {
      ...query,
    },
    headers: {
      ['x-access-token']: getToken(),
    },
  };

  try {
    const resp = yield call(axios.get, url, options);
    yield put(getNewsSuccess(resp.data.data));
  } catch (err) {
    // yield put(loginFailure(err));
  }
}

/**
 * Request delete news
 */
export function* deleteNewsHandler({ ids }) {
  const options = {
    headers: {
      ['x-access-token']: getToken(),
    }
  }

  try {
    yield all(ids.map((i) => {
      const url = `${root}/news/${i}`;
      return call(axios.delete, url, options);
    }));
    yield put(deleteNewsSuccess());
  } catch (err) {
    console.log(err);
    // yield put(loginFailure(err));
  }
}


/**
 * Root saga manages watcher lifecycle
 */
export default function* newsSaga() {
  yield takeLatest(GET_NEWS.REQUEST, getNewsHandler);
  yield takeLatest(DELETE_NEWS.REQUEST, deleteNewsHandler);
}
