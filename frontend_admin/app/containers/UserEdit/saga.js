/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import _ from 'lodash';
import { push } from 'react-router-redux';
import { getToken } from 'services/auth';
import { call, put, takeLatest, all } from 'redux-saga/effects';
import { UPDATE_USER, GET_USER_DETAIL, GET_DATA_INIT } from './constants';
import {
  updateUserSuccess,
  updateUserFailure,
  getUserDetailFailure,
  getUserDetailSuccess,
  getDataInitSuccess,
} from './actions';

const root = '/api';

/**
 * Request get detail user
 */
export function* getDetailUserHandler({ id }) {
  const url = `${root}/users/${id}`;
  const options = {
    headers: {
      'x-access-token': getToken(),
    },
  };
  try {
    const userDetail = yield call(axios.get, url, options);
    yield put(getUserDetailSuccess(userDetail.data.data));
  } catch (err) {
    yield put(
      getUserDetailFailure(
        _.get(err, 'response.data.error', 'Unknown error from server'),
      ),
    );
  }
}

/**
 * Request update user
 */
export function* updateUserHandler({ data, blockUser, id }) {
  const url = `${root}/users/${id}`;
  const urlBlock = `${root}/users/block/${id}`;
  const options = {
    headers: {
      'x-access-token': getToken(),
    },
  };
  try {
    yield call(axios.put, url, data, options);
    yield call(axios.put, urlBlock, {
      ...blockUser,
      status: +blockUser.status,
    }, options);
    yield put(updateUserSuccess());
    yield put(push('/users'));
  } catch (err) {
    yield put(
      updateUserFailure(
        _.get(err, 'response.data.error', 'Unknown error from server'),
      ),
    );
  }
}

/**
 * Request get data init
 */
export function* getDataInitHandler() {
  try {
    const resp = yield all([
      call(axios.get, `${root}/categories`),
      call(axios.get, `${root}/subjects`),
      call(axios.get, `${root}/classes`),
      call(axios.get, `${root}/collections`),
    ]);
    const categories = _.get(resp, '[0].data.data');
    const subjects = _.get(resp, '[1].data.data');
    const classes = _.get(resp, '[2].data.data');
    const collections = _.get(resp, '[3].data.data');
    yield put(getDataInitSuccess({ categories, subjects, classes, collections }));
  } catch (err) {
  // yield put(editDocFailure(_.get(err, 'response.data.error', 'Unknown error from server')));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* userEditSaga() {
  yield takeLatest(UPDATE_USER.REQUEST, updateUserHandler);
  yield takeLatest(GET_USER_DETAIL.REQUEST, getDetailUserHandler);
  yield takeLatest(GET_DATA_INIT.REQUEST, getDataInitHandler);
}
