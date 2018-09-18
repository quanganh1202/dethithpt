import {
  GET_CLASSES,
} from './constants';

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_CLASSES.REQUEST
 */
export function getClasses() {
  return {
    type: GET_CLASSES.REQUEST,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of GET_CLASSES.SUCCESS
 */
export function getClassesSuccess(classes) {
  return {
    type: GET_CLASSES.SUCCESS,
    classes,
  };
}
