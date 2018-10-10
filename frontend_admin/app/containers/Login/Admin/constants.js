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
export const CLEAR_MESSAGE = 'thpt/Home/CLEAR_MESSAGE';
