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
import { Switch, Route, Link } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faFolder, faCloudDownloadAlt } from '@fortawesome/free-solid-svg-icons';
import { faMoneyBillAlt } from '@fortawesome/free-regular-svg-icons';
import UploadDocument from 'containers/UploadDocument/Loadable';
import styled from 'styled-components';
import _ from 'lodash';
import moment from 'moment';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { LIST_COLOR } from 'utils/constants';
import FacebookLogin from 'containers/Login/Facebook';
import GoogleLogin from 'containers/Login/Google';
import Layout from 'components/Layout';
import Tab from 'components/Tab';
import TabList from 'components/Tab/TabList';
import List from 'components/List';
import ListItem from 'components/ListItem';
import PopUp from 'components/PopUp';
import SocialButton from 'components/SocialButton';
import { getDocumentDetails, getDocumentsList } from './actions';
import {
  makeSelectDocument,
  makeSelectLoading,
  makeSelectDocuments,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
import { getUser } from 'services/auth';
import GreyTitle from 'containers/HomePage/GreyTitle';
import Wrapper from './Wrapper';

library.add(faMoneyBillAlt, faFolder, faCog, faCloudDownloadAlt);

const items = [
  {
    id: '1',
    title: 'Đề thi THPT quốc gia chính thức - 2016 - Môn Địa lí - Bộ Giáo dục',
    category: 'Đề thi THPT Quốc Gia',
    subject: 'Môn Toán',
    class: '12',
    year: '2018 - 2019',
    specific: 'Đề thi thử trường chuyên',
    pages: 24,
    price: 10000,
    views: 28960,
    createdAt: '30/12/2017'
  },
  {
    id: '2',
    title: 'Đề thi THPT quốc gia chính thức - 2016 - Môn Địa lí - Bộ Giáo dục',
    category: 'Đề thi THPT Quốc Gia',
    subject: 'Môn Toán',
    class: '12',
    year: '2018 - 2019',
    specific: 'Đề thi thử trường chuyên',
    pages: 24,
    price: 10000,
    views: 28960,
    createdAt: '30/12/2017'
  },
  {
    id: '3',
    title: 'Đề thi THPT quốc gia chính thức - 2016 - Môn Địa lí - Bộ Giáo dục',
    category: 'Đề thi THPT Quốc Gia',
    subject: 'Môn Toán',
    class: '12',
    year: '2018 - 2019',
    specific: 'Đề thi thử trường chuyên',
    pages: 24,
    price: 10000,
    views: 28960,
    createdAt: '30/12/2017'
  },
];

const numberWithCommas = (x) => {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

/* eslint-disable react/prefer-stateless-function */
export class DocumentDetails extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      data: null,
    };
    this.loadMoreDocs = this.loadMoreDocs.bind(this);
  }

  componentWillMount() {
    if (this.props.match.params.id) {
      this.props.getDocumentDetails(this.props.match.params.id);
    }
    if (!this.props.documents.data.length) {
      this.props.getDocumentsList({
        sortBy: 'createdAt.desc',
        offset: 0,
        number: 2,
      });
    }
  }

  loadMoreDocs() {
    this.props.getDocumentsList({
      sortBy: 'createdAt.desc',
      offset: this.props.documents.data.length,
      number: 2,
    });
  }

  render() {
    return (
      <Wrapper>
        <Helmet>
          <title>UploadDocument</title>
          <meta name="description" content="Description of UploadDocument" />
        </Helmet>
        <Tab
          key="dang-ban-tai-lieu"
          style={{ background: 'white' }}
          title={'Đề thi thử THPT Quốc Gia'}
          className="doc-details"
          content={
            !_.isEmpty(this.props.document) ? (
            <div style={{ padding: "0px 20px 10px" }}>
              <div className="doc-title">
                <p>{this.props.document.name}</p>
              </div>
              <div className="doc-category">
                <ul>
                  <li>{'Đề thi THPT Quốc Gia'}</li>
                  <li>{'Môn Toán'}</li>
                  <li>{'12'}</li>
                  <li>{'2018 - 2019'}</li>
                  <li>
                    <FontAwesomeIcon className={'specific-icon'} icon={['far', 'folder-open']} />
                    {'Đề thi thử trường chuyên'}
                  </li>
                </ul>
              </div>
              <div className="doc-action">
                <button className="btn-download">
                  <FontAwesomeIcon className={'title-icon'} icon={['fas', 'cloud-download-alt']} /> Tải file word (10,000đ)
                </button>
                <button className="btn-view">
                  <FontAwesomeIcon className={'title-icon'} icon={['far', 'eye']} /> Xem thử (52 trang)
                </button>
              </div>
              <div className="doc-action">
                <button className="btn-report">Báo lỗi tài liệu</button>
                <button className="btn-favorite">Lưu tài liệu</button>
                <p className="created-date">
                  <FontAwesomeIcon className={'info-icon'} icon={['far', 'clock']} /> {moment(this.props.document.createdAt).format('DD/MM/YYYY')}
                </p>
              </div>
              <div className="doc-description">
                <p>Mô tả đề thi</p>
                <p>{this.props.document.description || 'description'}</p>
              </div>
              <div className="doc-tags">
                <p>Từ khóa:</p>
                <p className="tag-item">#test</p>
              </div>
            </div>) : null
          }
        />
        <Tab
          key="latest-docs"
          title="Tài liệu khác liên quan"
          className="grey-box"
          customTitle={
            <GreyTitle className="custom-title">
              <p>Tài liệu mới đăng</p>
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
    getDocumentsList: (query) => dispatch(getDocumentsList(query)),
  };
}

const mapStateToProps = createStructuredSelector({
  document: makeSelectDocument(),
  documents: makeSelectDocuments(),
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
