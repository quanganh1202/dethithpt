/**
 *
 * Asynchronously loads the component for UploadDocument
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
