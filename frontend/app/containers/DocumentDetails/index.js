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
import PopUp from 'components/PopUp';
import LoadingIndicator from 'components/LoadingIndicator';
import downloading from 'images/download.gif';
import { getDocumentDetails, getDocumentsList } from './actions';
import { requestDownload, removeFileSave, removeMessage } from 'containers/HomePage/actions';
import {
  makeSelectDocument,
  makeSelectLoading,
  makeSelectDocuments,
} from './selectors';
import {
  makeSelectFile,
  makeSelectMessage,
} from 'containers/HomePage/selectors';
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

const errorMapping = {
  unknown_error_download: 'Tài liệu không còn tồn tại hoặc có lỗi, vui lòng báo lại cho admin!',
  not_enough_money: 'Tài khoản không còn đủ tiền để thanh toán, vui lòng nạp thêm!',
}

/* eslint-disable react/prefer-stateless-function */
export class DocumentDetails extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      data: null,
    };
    this.loadMoreDocs = this.loadMoreDocs.bind(this);
    this.handleDownloadFile = this.handleDownloadFile.bind(this);
    this.showPreview = this.showPreview.bind(this);
  }

  componentWillMount() {
    window.scrollTo(0, 0);
    if (this.props.match.params.id) {
      this.props.getDocumentDetails(this.props.match.params.id);
    }
    if (!this.props.documents.data.length) {
      this.props.getDocumentsList({
        sort: 'createdAt.desc',
        offset: 0,
        size: itemsPerLoad,
      });
    }
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
      const blob = new Blob([nextProps.file]);
      FileSaver.saveAs(blob, _.get(this.props, 'document.name', 'download'));
      this.props.removeFileSave();
    }
  }

  componentWillUnmount() {
    this.props.removeMessage();
  }

  loadMoreDocs() {
    this.props.getDocumentsList({
      sort: 'createdAt.desc',
      offset: this.props.documents.data.length,
      size: itemsPerLoad,
    });
  }
  
  handleDownloadFile() {
    this.props.requestDownload(this.props.match.params.id);
  }

  showPreview() {
    this.setState({ preview: true });
  }

  render() {
    const { document } = this.props;
    return (
      <Wrapper>
        <Helmet>
          <title>Tài liệu</title>
          <meta name="description" content="Description of UploadDocument" />
        </Helmet>
        <Tab
          key="chi-tiet-tai-lieu"
          style={{ background: 'white' }}
          title={'Đề thi thử THPT Quốc Gia'}
          className="doc-details"
          content={
            this.props.loading ? (
              <LoadingIndicator />
            ) : (
            !_.isEmpty(document) ? (
            <div style={{ padding: "0px 20px 10px" }}>
              <div className={`error-document ${this.props.message && 'show'}`}>
                {errorMapping[this.props.message] || 'Có lỗi xảy ra, vui lòng báo lại cho admin!'}
              </div>
              <div className="doc-title">
                <p>{_.get(document, 'name')}</p>
              </div>
              <div className="doc-category">
                <ul>
                {_.get(document, 'cates', []).map((i) => <li key={i.cateId}>
                  {i.cateName}
                </li>)}
                {_.get(document, 'subjects', []).map((i) => <li key={i.subjectId}>
                  {i.subjectName.includes('Môn') ? i.subjectName : `Môn ${i.subjectName}`}
                </li>)}
                {_.get(document, 'classes', []).map((i) => <li key={i.classId}>
                  {i.className.includes('Lớp') ? i.className : `Lớp ${i.className}`}
                </li>)}
                {_.get(document, 'yearSchool', []).map((i) => <li key={i}>{i}</li>)}
                {_.get(document, 'collections', []).map((i) => <li key={i.collectionId}>
                  <FontAwesomeIcon className={'specific-icon'} icon={['far', 'folder-open']} />
                  {i.collectionName}
                </li>)}
                </ul>
              </div>
              <div className="doc-action">
                <button className="btn-download" onClick={this.handleDownloadFile}>
                  <FontAwesomeIcon className={'title-icon'} icon={['fas', 'cloud-download-alt']} /> Tải file word ({numberWithCommas((document.price || 0).toString())}đ)
                </button>
                <button className={`btn-view ${!document.images ? 'loading' : ''}`} onClick={document.images ? this.showPreview : () => {}}>
                  <FontAwesomeIcon className={'title-icon'} icon={['far', 'eye']} /> Xem thử ({numberWithCommas((document.totalPages || 0).toString())} trang)
                  <img src={downloading} />
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
                <p dangerouslySetInnerHTML={{ __html: document.description }}></p>
              </div>
              <div className="doc-tags">
                <p>Từ khóa:</p>
                {document.tags && document.tags.map((t, idx) => <p key={idx} className="tag-item">#{t}</p>)}
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
        <PopUp
          show={this.state.preview}
          close
          width="auto"
          onClose={() => this.setState({ preview: false })}
          content={
            <div style={{ textAlign: 'center' }}>
              <div className="document-title">
                <span className="bold">Đọc thử:</span> {this.props.document.name}
              </div>
              {
                _.get(document, 'images', [])
                  .map((imgData, index) => 
                    <div key={`preview-${index}`} ><img
                      src={`data:image/png;base64,${imgData}`} 
                      alt="preview"
                    /></div>)
              }
            </div>
          }
        />
      </Wrapper> 
    );
  }
}

DocumentDetails.propTypes = {
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
    removeMessage: () => dispatch(removeMessage()),
  };
}

const mapStateToProps = createStructuredSelector({
  document: makeSelectDocument(),
  documents: makeSelectDocuments(),
  loading: makeSelectLoading(),
  file: makeSelectFile(),
  message: makeSelectMessage(),
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
