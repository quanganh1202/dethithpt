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
const container = 'thpt/users';
export const GET_USERS = defineAction('GET_USERS', ['REQUEST', 'SUCCESS', 'FAILURE'], container);
export const DELETE_USERS = defineAction('DELETE_USERS', ['REQUEST', 'SUCCESS', 'FAILURE'], container);
export const GET_DATA_INIT = defineAction('GET_DATA_INIT', ['REQUEST', 'SUCCESS', 'FAILURE'], container);
export const GET_HISTORY = defineAction('GET_HISTORY', ['REQUEST', 'SUCCESS', 'FAILURE'], container);
export const CLEAR_DATA = defineAction('CLEAR_DATA', container);
export const CLEAR_PROCESS_STATUS = defineAction('CLEAR_PROCESS_STATUS', container);
