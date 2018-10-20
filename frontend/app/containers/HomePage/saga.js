/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';
import {
  LOGIN_REQUEST,
  UPDATE_USER_INFO_REQUEST,
  GET_DOC_LIST_REQUEST,
  GET_CATE_LIST_REQUEST,
  GET_COLLECTION_LIST_REQUEST,
  GET_TAGS_REQUEST,
  REQUEST_DOWNLOAD,
  REQUEST_PURCHASE,
  GET_NEWS,
  GET_PREVIEW,
  GET_GENERAL_INFO,
} from './constants';
import {
  loginSuccess,
  loginFailure,
  updateUserInfoSuccess,
  updateUserInfoFailure,
  getDocumentsListSuccess,
  getCategoriesSuccess,
  getCollectionsSuccess,
  getTagsSuccess,
  getNewsSuccess,
  requestDownloadSuccess,
  requestDownloadFailure,
  requestPurchase,
  requestPurchaseFailure,
  getPreviewSuccess,
  getGeneralInformationSuccess,
} from './actions';
import { getUserDetail } from 'containers/App/actions';
import { getToken, mappingUser } from 'services/auth';

const root = '/api';
/**
 * Request to login using social network token
 */
export function* loginHandler({ payload }) {
  const url = `${root}/login`;

  try {
    const resp = yield call(axios.post, url, payload);
    yield put(loginSuccess(resp.data));
    const user = mappingUser(resp.data.token);
    if (user.status === 1) {
      yield put(getUserDetail(user.id, true));
    }
  } catch (err) {
    yield put(loginFailure(err));
  }
}

/**
 * Request update user info
 */
export function* updateUserHandler({ payload, token }) {
  const url = `${root}/register`;
  const options = {
    headers: {
      ['x-access-token']: token,
    },
  }

  try {
    const resp = yield call(axios.post, url, payload, options);
    yield put(updateUserInfoSuccess(resp.data));
    const user = mappingUser(resp.data.token);
    if (user.status === 1) {
      yield put(getUserDetail(user.id, true));
    }
  } catch (err) {
    yield put(updateUserInfoFailure());
    // yield put(loginFailure(err));
  }
}

/**
 * Request get document list
 */
export function* getDocumentsListHandler({ query }) {
  const url = `${root}/documents`;

  try {
    const resp = yield call(axios.get, url, { params: query });
    yield put(getDocumentsListSuccess(resp.data));
  } catch (err) {
    // yield put(loginFailure(err));
  }
}

/**
 * Request get categories list
 */
export function* getCategoriesHandler() {
  const url = `${root}/categories?size=10000&sort=position.asc`;

  try {
    const resp = yield call(axios.get, url);
    yield put(getCategoriesSuccess(resp.data.data));
  } catch (err) {
    // yield put(loginFailure(err));
  }
}

/**
 * Request get collections list
 */
export function* getCollectionsHandler({ queryCollection, getAll }) {
  const url = `${root}/collections`;
  const sort = [ queryCollection.cateId ? 'priorityCate.desc' : 'priority.desc', 'position.asc']
  const options = {
    params: {
      ...queryCollection,
      sort,
      size: getAll ? 10000 : 10,
    },
  };
  try {
    const resp = yield call(axios.get, url, options);
    yield put(getCollectionsSuccess(resp.data.data, resp.data.total, getAll));
  } catch (err) {
    // yield put(loginFailure(err));
  }
}

/**
 * Request get tags list
 */
export function* getTagsHandler() {
  const url = `${root}/tags`;

  try {
    const resp = yield call(axios.get, url);
    yield put(getTagsSuccess(resp.data.data));
  } catch (err) {
    // yield put(loginFailure(err));
  }
}


/**
 * Request get news list
 */
export function* getNewsHandler() {
  const url = `${root}/news?sort=priority.desc&type=news&size=5`;

  try {
    const resp = yield call(axios.get, url);
    yield put(getNewsSuccess(resp.data.data));
  } catch (err) {
    // yield put(loginFailure(err));
  }
}

/**
 * Request get news list
 */
export function* getGeneralInformationHandler() {
  const url = `${root}/news?type=general`;

  try {
    const resp = yield call(axios.get, url);
    yield put(getGeneralInformationSuccess(resp.data.data));
  } catch (err) {
    // yield put(loginFailure(err));
  }
}

/**
 * Request download document
 */
export function* requestDownloadHandler({ id }) {
  const url = `${root}/download/${id}`;
  const options = {
    headers: {
      ['x-access-token']: getToken(),
    },
  }

  try {
    yield call(axios.post, url, {}, options);
    const resp = yield call(axios.post, `${url}?download`, {}, { ...options, responseType: 'blob' });
    yield put(requestDownloadSuccess(resp.data));
  } catch (err) {
    const errorMessage = _.get(err, 'response.data.error', 'Unknown server error');
    if (errorMessage.includes('You have not purchased document')) {
      yield put(requestPurchase(id, true));
    } else {
      yield put(requestDownloadFailure('unknown_error_download'));
    }
  }
}

export function* purchaseDocumentHandler({ id, download }) {
  const url = `${root}/documents/${id}/purchase`;
  const options = {
    headers: {
      ['x-access-token']: getToken(),
    }
  }

  try {
    yield call(axios.post, url, {}, options);
    if (download) {
      const downloadUrl = `${root}/download/${id}?download`
      const downloadRes = yield call(axios.post, downloadUrl, {}, { ...options, responseType: 'blob', });
      yield put(requestDownloadSuccess(downloadRes.data));
    }
  } catch (err) {
    if (_.get(err, 'response.data.error', 'Unknown server error') === 'Not enough money') {
      yield put(requestPurchaseFailure('not_enough_money'));
    } else {
      yield put(requestDownloadFailure('unknown_error_download'));
    }
  }
}

/**
 * Request to get preview document by id
 */
export function* getPreviewHandler({ id }) {
  const url = `${root}/documents/${id}`;

  try {
    const resImages = yield call(axios.get, `${url}/preview`);
    yield put(getPreviewSuccess(Array.isArray(resImages.data) ? resImages.data : []));
  } catch (err) {
    // yield put(loginFailure(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* homeSaga() {
  yield takeLatest(LOGIN_REQUEST, loginHandler);
  yield takeLatest(UPDATE_USER_INFO_REQUEST, updateUserHandler);
  yield takeLatest(GET_DOC_LIST_REQUEST, getDocumentsListHandler);
  yield takeLatest(GET_CATE_LIST_REQUEST, getCategoriesHandler);
  yield takeLatest(GET_COLLECTION_LIST_REQUEST, getCollectionsHandler);
  yield takeLatest(GET_TAGS_REQUEST, getTagsHandler);
  yield takeLatest(GET_NEWS.REQUEST, getNewsHandler);
  yield takeLatest(GET_GENERAL_INFO.REQUEST, getGeneralInformationHandler);
  yield takeLatest(REQUEST_DOWNLOAD.REQUEST, requestDownloadHandler);
  yield takeLatest(REQUEST_PURCHASE.REQUEST, purchaseDocumentHandler);
  yield takeLatest(GET_PREVIEW.REQUEST, getPreviewHandler);
}
