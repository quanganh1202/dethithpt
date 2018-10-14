/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import {
  GET_USER_DETAILS,
} from './constants';
import {
  getUserDetailsSuccess,
  getUserDetailsFailure,
} from './actions';
import { getToken } from 'services/auth';

const root = '/api';
/**
 * Request to login using social network token
 */
export function* getUserDetailsHandler({ id }) {
  const url = `${root}/users/${id}`;
  const options = {
    headers: {
      ['x-access-token']: getToken(),
    },
  }

  try {
    const resp = yield all([
      call(axios.get, url, options),
      call(axios.get, `${root}/purchase?userId=${id}`),
      call(axios.get, `${root}/purchase?action=PURCHASE&userId=${id}`),
      call(axios.get, `${root}/documents?approved=all&userId=${id}`),
    ]);
    const user = resp[0].data.data;
    const history = resp[1].data.data;
    const download = resp[2].data.data;
    const upload = resp[3].data.data.filter((i) => parseInt(i.userId) === parseInt(id));
    yield put(getUserDetailsSuccess({ user, history, upload, download }));
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
