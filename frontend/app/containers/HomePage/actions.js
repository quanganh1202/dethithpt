import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  UPDATE_USER_INFO_REQUEST,
  UPDATE_USER_INFO_SUCCESS,
  UPDATE_USER_INFO_FAILURE,
  GET_DOC_LIST_REQUEST,
  GET_DOC_LIST_SUCCESS,
  GET_CATE_LIST_REQUEST,
  GET_CATE_LIST_SUCCESS,
  GET_COLLECTION_LIST_REQUEST,
  GET_COLLECTION_LIST_SUCCESS,
  GET_TAGS_REQUEST,
  GET_TAGS_SUCCESS,
  REQUEST_DOWNLOAD,
  REQUEST_PURCHASE,
  REMOVE_FILE_SAVE,
  REMOVE_MESSAGE,
  GET_NEWS,
  QUERY_DATA,
} from './constants';

/**
 * Changes the input field of the form
 *
 * @param  {name} payload to request login user
 *
 * @return {object}    An action object with a type of LOGIN_REQUEST
 */
export function login(payload) {
  return {
    type: LOGIN_REQUEST,
    payload,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} payload get from backend after login
 *
 * @return {object}    An action object with a type of LOGIN_SUCCESS
 */
export function loginSuccess(payload) {
  return {
    type: LOGIN_SUCCESS,
    payload,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} err from login
 *
 * @return {object}    An action object with a type of LOGIN_FAILURE
 */
export function loginFailure(err) {
  return {
    type: LOGIN_FAILURE,
    err,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} payload to complete user information
 *
 * @return {object}    An action object with a type of UPDATE_USER_INFO_REQUEST
 */
export function updateUserInfo(payload, token) {
  return {
    type: UPDATE_USER_INFO_REQUEST,
    payload,
    token,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {payload} payload get from backend after update successfully
 *
 * @return {object}    An action object with a type of UPDATE_USER_INFO_SUCCESS
 */
export function updateUserInfoSuccess(payload) {
  return {
    type: UPDATE_USER_INFO_SUCCESS,
    payload,
  };
}


/**
 * Changes the input field of the form
 *
 * @param  {payload} payload get from backend after update successfully
 *
 * @return {object}    An action object with a type of UPDATE_USER_INFO_FAILURE
 */
export function updateUserInfoFailure(message) {
  return {
    type: UPDATE_USER_INFO_FAILURE,
    message,
  };
}

/**
 * Changes the input field of the form
 *GET_TAGS_REQUEST
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CHANGE_USERNAME
 */
export function getDocumentsList(query, tag) {
  return {
    type: GET_DOC_LIST_REQUEST,
    query,
    tag,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CHANGE_USERNAME
 */
export function getDocumentsListSuccess({ data: documents, total }) {
  return {
    type: GET_DOC_LIST_SUCCESS,
    documents,
    total,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_CATE_LIST_REQUEST
 */
export function getCategories() {
  return {
    type: GET_CATE_LIST_REQUEST,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_CATE_LIST_SUCCESS
 */
export function getCategoriesSuccess(categories) {
  return {
    type: GET_CATE_LIST_SUCCESS,
    categories,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_CATE_LIST_REQUEST
 */
export function getCollections(queryCollection = {}) {
  return {
    type: GET_COLLECTION_LIST_REQUEST,
    queryCollection,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_CATE_LIST_SUCCESS
 */
export function getCollectionsSuccess(collections) {
  return {
    type: GET_COLLECTION_LIST_SUCCESS,
    collections,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_NEWS.REQUEST
 */
export function getNews() {
  return {
    type: GET_NEWS.REQUEST,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_NEWS.SUCCESS
 */
export function getNewsSuccess(news) {
  return {
    type: GET_NEWS.SUCCESS,
    news,
  };
}

export function getTags() {
  return {
    type: GET_TAGS_REQUEST,
  };
}

export function getTagsSuccess(tags) {
  return {
    type: GET_TAGS_SUCCESS,
    tags,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of REQUEST_DOWNLOAD.REQUEST
 */
export function requestDownload(id) {
  return {
    type: REQUEST_DOWNLOAD.REQUEST,
    id,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of REQUEST_DOWNLOAD.SUCCESS
 */
export function requestDownloadSuccess(file) {
  return {
    type: REQUEST_DOWNLOAD.SUCCESS,
    file,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of REQUEST_DOWNLOAD.FAILURE
 */
export function requestDownloadFailure(message) {
  return {
    type: REQUEST_DOWNLOAD.FAILURE,
    message,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of REQUEST_PURCHASE.REQUEST
 */
export function requestPurchase(id, download) {
  return {
    type: REQUEST_PURCHASE.REQUEST,
    id,
    download,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of REQUEST_PURCHASE.SUCCESS
 */
export function requestPurchaseSuccess(file) {
  return {
    type: REQUEST_PURCHASE.SUCCESS,
    file,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of REQUEST_PURCHASE.FAILURE
 */
export function requestPurchaseFailure(message) {
  return {
    type: REQUEST_PURCHASE.FAILURE,
    message,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of REMOVE_FILE_SAVE
 */
export function removeFileSave() {
  return {
    type: REMOVE_FILE_SAVE,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of REMOVE_FILE_SAVE
 */
export function removeMessage() {
  return {
    type: REMOVE_MESSAGE,
  };
}

export function updateQuery(queryCollection) {
  return {
    type: QUERY_DATA,
    queryCollection,
  };
}
