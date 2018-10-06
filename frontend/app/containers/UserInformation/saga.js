/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import {
  GET_USER_DETAILS,
} from './constants';
import {
  getUserDetailsSuccess,
  getUserDetailsFailure,
} from './actions';
import { getToken } from 'services/auth';

const rootCommand = '/api';
/**
 * Request to login using social network token
 */
export function* getUserDetailsHandler({ id }) {
  const url = `${rootCommand}/users/${id}`;
  const options = {
    headers: {
      ['x-access-token']: getToken(),
    },
  }

  try {
    const resp = yield call(axios.get, url, options);
    yield put(getUserDetailsSuccess(resp.data.data));
  } catch (err) {
    yield put(getUserDetailsFailure(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* homeSaga() {
  yield takeLatest(GET_USER_DETAILS.REQUEST, getUserDetailsHandler);
}
