/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';
import { getToken } from 'services/auth';
import { GET_USER_DETAILS, GET_MENU } from './constants';
import { getUserDetailSuccess, getUserDetailFailure, getMenuSuccess } from './actions';

const root = '/api';
/**
 * Request to login using social network token
 */
export function* getUserDetailsHandler({ id }) {
  const url = `${root}/users/${id}`;
  const options = {
    headers: {
      'x-access-token': getToken(),
    },
  };
  try {
    const resp = yield call(axios.get, url, options);
    const { notifyStatus, notifyText } = resp.data.data;
    let popoutStt;
    if (notifyStatus === '1' && notifyText) {
      popoutStt = true;
      axios.put(
        url,
        {
          notifyStatus: '0',
        },
        options,
      );
    }
    yield put(getUserDetailSuccess(resp.data.data, popoutStt));
  } catch (err) {
    yield put(getUserDetailFailure(err));
  }
}

/**
 * Request get menu list
 */
export function* getMenuHandler() {
  const url = `${root}/news?type=menu&sort=position.desc`;

  try {
    const resp = yield call(axios.get, url);
    yield put(getMenuSuccess(resp.data.data));
  } catch (err) {
    // yield put(loginFailure(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* homeSaga() {
  yield takeLatest(GET_USER_DETAILS.REQUEST, getUserDetailsHandler);
  yield takeLatest(GET_MENU.REQUEST, getMenuHandler);
}
