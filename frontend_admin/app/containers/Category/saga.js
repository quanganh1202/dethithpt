/**
 * Gets the repositories of the user from Github
 */
import axios from 'axios';
import _ from 'lodash';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { getToken } from 'services/auth';
import { GET_CATEGORIES_REQUEST, DELETE_CATES, UPDATE_CATES } from './constants';
import {
  getCategoriesSuccess,
  deleteCatesSuccess,
  updateCategoriesSuccess,
} from './actions';

const root = '/api';

/**
 * Request get document list
 */
export function* getCategoriesHandler({ queries }) {
  const url = `${root}/categories`;
  const options = {
    headers: {
      ['x-access-token']: getToken(),
    },
    params: {
      ...queries,
    }
  }

  try {
    const resp = yield call(axios.get, url, options);
    const cateIds = resp.data.data.map((i) => i.id);
    const collections = yield call(axios.get, `${root}/collections?cateId=${cateIds.join()}`, options);
    const collectionsByCate = collections.data.data.reduce((acc, i) => {
      const newAcc = { ...acc };
      i.cates.forEach((cate) => {
        if (newAcc[cate.cateId]) {
          newAcc[cate.cateId] += 1;
        } else {
          newAcc[cate.cateId] = 1;
        }
      })
      return newAcc;
    }, {});
    const mappedCates = resp.data.data.map((i) => ({ ...i, numOfCollections: collectionsByCate[i.id] || 0 }));
    yield put(getCategoriesSuccess(mappedCates, resp.data.total));
  } catch (err) {
    // yield put(loginFailure(err));
  }
}

/**
 * Request delete categories
 */
export function* deleteCatesHandler({ ids }) {
  const options = {
    headers: {
      ['x-access-token']: getToken(),
    }
  }

  try {
    yield all(ids.map((i) => {
      const url = `${root}/categories/${i}`;
      return call(axios.delete, url, options);
    }));
    yield put(deleteCatesSuccess());
  } catch (err) {
    console.log(err);
    // yield put(loginFailure(err));
  }
}

/**
 * Request update categories
 */
export function* updateCatesHandler({ cates }) {
  const options = {
    headers: {
      ['x-access-token']: getToken(),
    }
  }

  try {
    yield all(cates.map((i) => {
      const item = { ...i };
      const url = `${root}/categories/${item.id}`;
      delete item.id;
      return call(axios.put, url, item, options);
    }));
    yield put(updateCategoriesSuccess());
  } catch (err) {
    console.log(err);
    // yield put(loginFailure(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* homeSaga() {
  yield takeLatest(GET_CATEGORIES_REQUEST, getCategoriesHandler);
  yield takeLatest(DELETE_CATES.REQUEST, deleteCatesHandler);
  yield takeLatest(UPDATE_CATES.REQUEST, updateCatesHandler);
}
