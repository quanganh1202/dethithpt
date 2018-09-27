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
export function* getUsersHandler({ query }) {
  const url = `${root}/users`;
  const options = {
    params: {
      ...query,
    }
  }

  try {
    const resp = yield call(axios.get, url, options);
    yield put(getUsersSuccess(resp.data));
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
