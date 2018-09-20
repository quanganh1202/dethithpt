/*
 * HomeConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */
import { defineAction } from 'redux-define';
const container = 'thpt/DocumentDetails';
export const GET_DOC_DETAILS_REQUEST = 'thpt/DocumentDetails/GET_DOC_DETAILS/REQUEST';
export const GET_DOC_DETAILS_SUCCESS = 'thpt/DocumentDetails/GET_DOC_DETAILS/SUCCESS';
export const GET_DOC_LIST_REQUEST = 'thpt/DocumentDetails/GET_DOC_LIST/REQUEST';
export const GET_DOC_LIST_SUCCESS = 'thpt/DocumentDetails/GET_DOC_LIST/SUCCESS';
export const REQUEST_DOWNLOAD = defineAction('REQUEST_DOWNLOAD', ['REQUEST', 'SUCCESS', 'FAILURE'], container);
export const REQUEST_PURCHASE = defineAction('REQUEST_PURCHASE', ['REQUEST', 'SUCCESS', 'FAILURE'], container);
export const REMOVE_FILE_SAVE = defineAction('REMOVE_FILE_SAVE', container);
export const REMOVE_MESSAGE = defineAction('REMOVE_MESSAGE', container);
