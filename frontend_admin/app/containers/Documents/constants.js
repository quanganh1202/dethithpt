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
const container = 'thpt/documents';
export const GET_DOCS = defineAction('GET_DOCS', ['REQUEST', 'SUCCESS', 'FAILURE'], container);
export const APPROVE_DOCS = defineAction('APPROVE_DOCS', ['REQUEST', 'SUCCESS', 'FAILURE'], container);
export const DELETE_DOC = defineAction('DELETE_DOC', ['REQUEST', 'SUCCESS', 'FAILURE'], container);
export const UPDATE_DOCS = defineAction('UPDATE_DOCS', ['REQUEST', 'SUCCESS', 'FAILURE'], container);
export const CLEAR_DELETE_STATUS = defineAction('CLEAR_DELETE_STATUS', container);
export const GET_DATA_INIT = defineAction('GET_DATA_INIT', ['REQUEST', 'SUCCESS', 'FAILURE'], container);
export const REQUEST_DOWNLOAD = defineAction('REQUEST_DOWNLOAD', ['REQUEST', 'SUCCESS', 'FAILURE'], container);
export const REMOVE_FILE_SAVE = defineAction('REMOVE_FILE_SAVE', container);
export const GET_DOWNLOAD_HISTORY = defineAction('GET_DOWNLOAD_HISTORY', ['REQUEST', 'SUCCESS', 'FAILURE'], container);
