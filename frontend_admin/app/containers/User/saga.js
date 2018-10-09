/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import _ from 'lodash';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { getToken } from 'services/auth';
import { GET_USERS, GET_DATA_INIT, GET_HISTORY } from './constants';
import {
  getUsersSuccess,
  getDataInitSuccess,
  getHistorySuccess,
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
 * Request get user history
 */
export function* getHistoryHandler({ historyType, id }) {
  let url = '';
  const options = {
    headers: {
      'x-access-token': getToken(),
    },
    params: {
      sort: 'createdAt.desc',
    },
  };
  switch (historyType) {
    case '1':
      url = `${root}/purchase?action=PURCHASE&userId=${id}`;
      break;
    case '2':
      url = `${root}/documents?approved=all&userId=${id}`;
      break;
    case '3':
      url = `${root}/purchase?action=RECHARGE&userId=${id}`;
      break;
    case '4':
      url = `${root}/purchase?action=BONUS&userId=${id}`;
      break;
    case '5':
      url = `${root}/comments?userId=${id}`;
      break;
    default:
      break;
  }
  console.log(url);
  try {
    const resp = yield call(axios.get, url, options);
    yield put(getHistorySuccess(resp.data.data));
  } catch (err) {
    console.log(err);
  // yield put(editDocFailure(_.get(err, 'response.data.error', 'Unknown error from server')));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* userSaga() {
  yield takeLatest(GET_USERS.REQUEST, getUsersHandler);
  yield takeLatest(GET_DATA_INIT.REQUEST, getDataInitHandler);
  yield takeLatest(GET_HISTORY.REQUEST, getHistoryHandler);
}
