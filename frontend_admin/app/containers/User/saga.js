/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import _ from 'lodash';
import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { GET_USERS } from './constants';
import {
  getUsersSuccess,
} from './actions';

const root = '/api';

/**
 * Request get document list
 */
export function* getUsersHandler() {
  const url = `${root}/users`;

  try {
    const resp = yield call(axios.get, url);
    yield put(getUsersSuccess(resp.data.data));
  } catch (err) {
    // yield put(loginFailure(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* userSaga() {
  yield takeLatest(GET_USERS.REQUEST, getUsersHandler);
}
