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

const container = 'thpt/Home'

export const LOGIN_REQUEST = 'thpt/Home/LOGIN/REQUEST';
export const LOGIN_SUCCESS = 'thpt/Home/LOGIN/SUCCESS';
export const LOGIN_FAILURE = 'thpt/Home/LOGIN/FAILURE';
export const UPDATE_USER_INFO_REQUEST = 'thpt/Home/UPDATE_USER_INFO/REQUEST';
export const UPDATE_USER_INFO_SUCCESS = 'thpt/Home/UPDATE_USER_INFO/SUCCESS';
export const UPDATE_USER_INFO_FAILURE = 'thpt/Home/UPDATE_USER_INFO/FAILURE';
export const GET_DOC_LIST_REQUEST = 'thpt/Home/GET_DOC_LIST/REQUEST';
export const GET_DOC_LIST_SUCCESS = 'thpt/Home/GET_DOC_LIST/SUCCESS';
