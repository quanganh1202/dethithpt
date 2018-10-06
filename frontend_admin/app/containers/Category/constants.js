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
const container = 'thpt/categories';
export const GET_CATEGORIES_REQUEST = 'thpt/categories/GET_CATEGORIES/REQUEST';
export const GET_CATEGORIES_SUCCESS = 'thpt/categories/GET_CATEGORIES/SUCCESS';
export const DELETE_CATES = defineAction('DELETE_CATES', ['REQUEST', 'SUCCESS', 'FAILURE'], container);
export const CLEAR_PROCESS_STATUS = defineAction('CLEAR_PROCESS_STATUS', container);
