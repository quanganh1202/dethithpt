import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the uploadDocument state domain
 */

const selectUploadDocumentDomain = state =>
  state.get('uploadDocument', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by UploadDocument
 */

const makeSelectUploadDocument = () =>
  createSelector(selectUploadDocumentDomain, substate => substate.toJS());

export default makeSelectUploadDocument;
export { selectUploadDocumentDomain };
