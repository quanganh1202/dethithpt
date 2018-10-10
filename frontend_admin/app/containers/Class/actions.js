import {
  GET_CLASSES,
  DELETE_CLASSES,
  CLEAR_PROCESS_STATUS,
  UPDATE_CLASSES,
} from './constants';

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_CLASSES.REQUEST
 */
export function getClasses(queries) {
  return {
    type: GET_CLASSES.REQUEST,
    queries,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_CLASSES.SUCCESS
 */
export function getClassesSuccess(classes, total) {
  return {
    type: GET_CLASSES.SUCCESS,
    classes,
    total,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of DELETE_CLASSES.REQUEST
 */
export function deleteClasses(ids) {
  return {
    type: DELETE_CLASSES.REQUEST,
    ids,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of DELETE_CLASSES.SUCCESS
 */
export function deleteClassesSuccess() {
  return {
    type: DELETE_CLASSES.SUCCESS,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CLEAR_PROCESS_STATUS
 */
export function clearProcessStatus(all) {
  return {
    type: CLEAR_PROCESS_STATUS,
    all,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of UPDATE_CLASSES.REQUEST
 */
export function updateClasses(classes) {
  return {
    type: UPDATE_CLASSES.REQUEST,
    classes,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of UPDATE_CLASSES.SUCCESS
 */
export function updateClassesSuccess() {
  return {
    type: UPDATE_CLASSES.SUCCESS,
  };
}