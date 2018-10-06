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
const container = 'thpt/classes';
export const GET_CLASSES = defineAction('GET_CLASSES', ['REQUEST', 'SUCCESS', 'FAILURE'], container);
export const DELETE_CLASSES = defineAction('DELETE_CLASSES', ['REQUEST', 'SUCCESS', 'FAILURE'], container);
export const CLEAR_PROCESS_STATUS = defineAction('CLEAR_PROCESS_STATUS', container);
export const UPDATE_CLASSES = defineAction('UPDATE_CLASSES', ['REQUEST', 'SUCCESS', 'FAILURE'], container);
