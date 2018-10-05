/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import _ from 'lodash';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { GET_USERS, GET_DATA_INIT } from './constants';
import {
  getUsersSuccess,
  getDataInitSuccess,
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
 * Request get data init
 */
export function* getDataInitHandler() {
  try {
    const resp = yield all([
      call(axios.get, `${root}/classes`),
      call(axios.get, `${root}/purchase?action=RECHARGE`)
    ]);
    const classes = _.get(resp, '[0].data.data');
    const purchaseHistory = _.get(resp, '[1].data.data', []).reduce((acc, item) => {
      if (acc[item.userId]) {
        return { ...acc, [item.userId]: acc[item.userId] + item.money };
      }
      return { ...acc, [item.userId]: item.money };
    }, {});
    yield put(getDataInitSuccess({ classes, purchaseHistory }));
  } catch (err) {
  // yield put(editDocFailure(_.get(err, 'response.data.error', 'Unknown error from server')));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* userSaga() {
  yield takeLatest(GET_USERS.REQUEST, getUsersHandler);
  yield takeLatest(GET_DATA_INIT.REQUEST, getDataInitHandler);
}
