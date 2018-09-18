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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faFolder, faCloudDownloadAlt } from '@fortawesome/free-solid-svg-icons';
import { faMoneyBillAlt } from '@fortawesome/free-regular-svg-icons';
import _ from 'lodash';
import moment from 'moment';
import FileSaver from 'file-saver';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import Tab from 'components/Tab';
import List from 'components/List';
import ListItem from 'components/ListItem';
import LoadingIndicator from 'components/LoadingIndicator';
import { getDocumentDetails, getDocumentsList, requestDownload, removeFileSave } from './actions';
import {
  makeSelectDocument,
  makeSelectLoading,
  makeSelectFile,
  makeSelectDocuments,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
import GreyTitle from 'containers/HomePage/GreyTitle';
import Wrapper from './Wrapper';

library.add(faMoneyBillAlt, faFolder, faCog, faCloudDownloadAlt);

const numberWithCommas = (x) => {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

const itemsPerLoad = 10;

/* eslint-disable react/prefer-stateless-function */
export class Payment extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      data: null,
    };
    this.loadMoreDocs = this.loadMoreDocs.bind(this);
    this.handleDownloadFile = this.handleDownloadFile.bind(this);
  }

  componentWillMount() {
    // if (this.props.match.params.id) {
    //   this.props.getDocumentDetails(this.props.match.params.id);
    // }
    // if (!this.props.documents.data.length) {
    //   this.props.getDocumentsList({
    //     sort: 'createdAt.desc',
    //     offset: 0,
    //     size: itemsPerLoad,
    //   });
    // }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id) {
      window.scrollTo(0, 0);
      this.props.getDocumentDetails(nextProps.match.params.id);
      this.props.getDocumentsList({
        sort: 'createdAt.desc',
        offset: 0,
        size: itemsPerLoad,
      }, true);
    }
    if (!this.props.file && nextProps.file) {
      // console.log(JSON.stringify(nextProps.file))
      // const blob = new Blob(nextProps.file, { type: 'application/pdf' });
      // FileSaver.saveAs(blob);
      // this.props.removeFileSave()
    }
  }

  loadMoreDocs() {
    this.props.getDocumentsList({
      sort: 'createdAt.desc',
      offset: this.props.documents.data.length,
      size: itemsPerLoad,
    });
  }
  
  handleDownloadFile() {
//     const aFileParts = ['<a id="a"><b id="b">hey!</b></a>']; // an array consisting of a single DOMString
// const oMyBlob = new Blob(aFileParts, {type : 'text/html'}); // the blob

// FileSaver.saveAs(oMyBlob, 'test');
    this.props.requestDownload(this.props.match.params.id);
  }

  render() {
    console.log('here')
    const { document } = this.props;
    return (
      <Wrapper>
        <Helmet>
          <title>Tài liệu</title>
          <meta name="description" content="Description of UploadDocument" />
        </Helmet>
        <Tab
          key="thanh-toan"
          style={{ background: 'white' }}
          title={'NẠP TIỀN VÀO TÀI KHOẢN'}
          className="doc-details"
          content={
            this.props.loading ? (
              <LoadingIndicator />
            ) : (
            !_.isEmpty(document) ? (
            <div style={{ padding: "0px 20px 10px" }}>
              <div className="doc-title">
                <p>{_.get(document, 'name')}</p>
              </div>
              <div className="doc-category">
                <ul>
                  {_.get(document, 'cates[0].cateName') && <li>
                    {_.get(document, 'cates[0].cateName')}
                  </li>}
                  {document.subjectName && <li>
                    {document.subjectName.includes('Môn') 
                      ? document.subjectName
                      : `Môn ${document.subjectName}`}
                  </li>}
                  {document.className && <li>
                    {document.className.includes('Lớp') 
                      ? document.className
                      : `Lớp ${document.className}`}
                  </li>}
                  {document.yearSchool && <li>{document.yearSchool}</li>}
                  {document.collectionName && <li>
                    <FontAwesomeIcon className={'specific-icon'} icon={['far', 'folder-open']} />
                    {document.collectionName}
                  </li>}
                </ul>
              </div>
              <div className="doc-action">
                <button className="btn-download" onClick={this.handleDownloadFile}>
                  <FontAwesomeIcon className={'title-icon'} icon={['fas', 'cloud-download-alt']} /> Tải file word ({numberWithCommas((document.price || 0).toString())}đ)
                </button>
                <button className="btn-view">
                  <FontAwesomeIcon className={'title-icon'} icon={['far', 'eye']} /> Xem thử ({numberWithCommas((document.views || 0).toString())} trang)
                </button>
              </div>
              <div className="doc-action">
                <button className="btn-report">Báo lỗi tài liệu</button>
                <button className="btn-favorite">Lưu tài liệu</button>
                {document.createdAt && <p className="created-date">
                  <FontAwesomeIcon className={'info-icon'} icon={['far', 'clock']} /> {moment(document.createdAt).format('DD/MM/YYYY')}
                </p>}
              </div>
              <div className="doc-description">
                <p>Mô tả đề thi</p>
                <p>{document.description || 'description'}</p>
              </div>
              <div className="doc-tags">
                <p>Từ khóa:</p>
                {document.tags && document.tags.map((t) => (
                  t.tagText && <p className="tag-item">#{t.tagText}</p>
                ))}
              </div>
            </div>) : null)
          }
        />
        <Tab
          key="latest-docs"
          title="Tài liệu khác liên quan"
          className="grey-box"
          customTitle={
            <GreyTitle className="custom-title">
              <p>Tài liệu khác liên quan</p>
            </GreyTitle>
          }
          content={
            <div>
              <List
                items={this.props.documents.data}
                component={ListItem}
                loadMore={this.props.documents.data.length < this.props.documents.total}
                onLoadMore={this.loadMoreDocs}
              />
            </div>
          }
        />
      </Wrapper> 
    );
  }
}

Payment.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  repos: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  onSubmitForm: PropTypes.func,
  username: PropTypes.string,
  onChangeUsername: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    getDocumentDetails: (id) => dispatch(getDocumentDetails(id)),
    getDocumentsList: (query, clear) => dispatch(getDocumentsList(query, clear)),
    requestDownload: (id) => dispatch(requestDownload(id)),
    removeFileSave: () => dispatch(removeFileSave()),
  };
}

const mapStateToProps = createStructuredSelector({
  document: makeSelectDocument(),
  documents: makeSelectDocuments(),
  loading: makeSelectLoading(),
  file: makeSelectFile(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'documentDetails', reducer });
const withSaga = injectSaga({ key: 'documentDetails', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(DocumentDetails);
