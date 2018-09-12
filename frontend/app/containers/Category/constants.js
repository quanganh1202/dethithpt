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

const container = 'thpt/DocumentDetails';
export const GET_FILTER_DATA_REQUEST = 'thpt/DocumentDetails/GET_FILTER_DATA/REQUEST';
export const GET_FILTER_DATA_SUCCESS = 'thpt/DocumentDetails/GET_FILTER_DATA/SUCCESS';
export const GET_DOC_LIST_REQUEST = 'thpt/DocumentDetails/GET_DOC_LIST/REQUEST';
export const GET_DOC_LIST_SUCCESS = 'thpt/DocumentDetails/GET_DOC_LIST/SUCCESS';
