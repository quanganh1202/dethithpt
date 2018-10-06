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

const container = 'thpt/classEdit';
export const UPDATE_CLASS = defineAction(
  'UPDATE_CLASS',
  ['REQUEST', 'SUCCESS', 'FAILURE'],
  container,
);
export const GET_CLASS_DETAIL = defineAction(
  'GET_CLASS_DETAIL',
  ['REQUEST', 'SUCCESS', 'FAILURE'],
  container,
);
export const CLEAR_MESSAGE = defineAction('CLEAR_MESSAGE', container);
export const CLEAR_DATA = defineAction('CLEAR_DATA', container);
