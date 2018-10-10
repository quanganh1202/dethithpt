/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { library } from '@fortawesome/fontawesome-svg-core';
import { get } from 'lodash';
import FileSaver from 'file-saver';
import {
  faCog,
  faFolder,
  faCloudDownloadAlt,
} from '@fortawesome/free-solid-svg-icons';
import { faMoneyBillAlt } from '@fortawesome/free-regular-svg-icons';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import Tab from 'components/Tab';
import List from 'components/List';
import ListItem from 'components/ListItem';
import LoadingIndicator from 'components/LoadingIndicator';
import GreyTitle from 'containers/HomePage/GreyTitle';
import { makeSelectFile } from 'containers/HomePage/selectors';
import {
  getPreview,
  previewDoc,
  requestDownload,
  removeMessage,
  removeFileSave,
} from 'containers/HomePage/actions';
import { getDocumentsList } from './actions';
import { makeSelectLoading, makeSelectDocuments } from './selectors';
import reducer from './reducer';
import saga from './saga';
import Wrapper from './Wrapper';

library.add(faMoneyBillAlt, faFolder, faCog, faCloudDownloadAlt);

const itemsPerLoad = 10;

/* eslint-disable react/prefer-stateless-function */
export class SearchResult extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      downloadingFile: '',
    };
    this.loadMoreDocs = this.loadMoreDocs.bind(this);
  }

  componentWillMount() {
    if (this.props.location.search.split('=')[1]) {
      this.props.getDocumentsList(
        {
          sort: 'createdAt.desc',
          offset: 0,
          size: itemsPerLoad,
          tags: this.props.location.search.split('=')[1],
        },
        true,
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.location.search.split('=')[1] !==
      nextProps.location.search.split('=')[1]
    ) {
      window.scrollTo(0, 0);
      this.props.getDocumentsList(
        {
          sort: 'createdAt.desc',
          offset: 0,
          size: itemsPerLoad,
          tags: nextProps.location.search.split('=')[1],
        },
        true,
      );
    }
    if (!this.props.file && nextProps.file) {
      const blob = new Blob([nextProps.file]);
      FileSaver.saveAs(blob, get(this.state, 'downloadingFile', 'download'));
      this.setState({ downloadingFile: '' });
      this.props.removeFileSave();
    }
    if (!this.props.message && nextProps.message) {
      alert(
        errorMapping[nextProps.message] ||
          'Có lỗi xảy ra, vui lòng báo lại cho admin!',
      );
      this.props.removeMessage();
    }
  }

  loadMoreDocs() {
    this.props.getDocumentsList({
      sort: 'createdAt.desc',
      offset: this.props.documents.data.length,
      size: itemsPerLoad,
      tags: this.props.location.search.split('=')[1],
    });
  }

  render() {
    const { documents } = this.props;
    return (
      <Wrapper>
        <Helmet>
          <title>
            Tìm kiếm cho từ khóa {this.props.location.search.split('=')[1]}
          </title>
          <meta name="description" content="Description of UploadDocument" />
        </Helmet>
        <Tab
          key="latest-docs"
          title={`Kết quả cho từ khóa ${
            this.props.location.search.split('=')[1]
          }`}
          className="grey-box"
          customTitle={
            <GreyTitle className="custom-title">
              <p>
                Kết quả cho từ khóa: {this.props.location.search.split('=')[1]}
              </p>
            </GreyTitle>
          }
          content={
            this.props.loading ? (
              <LoadingIndicator />
            ) : (
              <div>
                {this.state.downloadingFile ? (
                  <div className="data-loading">
                    Vui lòng chờ xử lý...<LoadingIndicator />
                  </div>
                ) : null}
                <List
                  items={documents.data}
                  component={ListItem}
                  loadMore={documents.data.length < documents.total}
                  onLoadMore={this.loadMoreDocs}
                  onDownload={(id, name) => {
                    this.setState({ downloadingFile: name });
                    this.props.requestDownload(id);
                  }}
                  onPreview={doc => {
                    this.props.previewDoc(doc);
                    this.props.getPreview(doc.id);
                  }}
                />
              </div>
            )
          }
        />
      </Wrapper>
    );
  }
}

SearchResult.propTypes = {
  documents: PropTypes.object,
  loading: PropTypes.bool,
  getDocumentsList: PropTypes.func,
  location: PropTypes.object,
};

export function mapDispatchToProps(dispatch) {
  return {
    getDocumentsList: (query, clear) =>
      dispatch(getDocumentsList(query, clear)),
    previewDoc: doc => dispatch(previewDoc(doc)),
    getPreview: id => dispatch(getPreview(id)),
    requestDownload: id => dispatch(requestDownload(id)),
    removeFileSave: () => dispatch(removeFileSave()),
    removeMessage: () => dispatch(removeMessage()),
  };
}

const mapStateToProps = createStructuredSelector({
  documents: makeSelectDocuments(),
  loading: makeSelectLoading(),
  file: makeSelectFile(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'searchResult', reducer });
const withSaga = injectSaga({ key: 'searchResult', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(SearchResult);
