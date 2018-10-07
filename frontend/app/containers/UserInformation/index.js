/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Redirect, Link } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTv, faChartLine, faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons';
import { faCopy, faUserCircle, faClock } from '@fortawesome/free-regular-svg-icons';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import Layout from 'components/Layout';
import Tab from 'components/Tab';
import {
  getUserDetails,
} from './actions';
import {
  makeSelectUser,
  makeSelectHistory,
  makeSelectUpload,
  makeSelectDownload,
  makeSelectLoading,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
import { getUser, getToken } from 'services/auth';
import GreyTitle from './GreyTitle';
import Wrapper from './Wrapper';
import Button from './Button';
import SideNav from './SideNav';
import GeneralInformation from './GeneralInformation';
import HistoryList from './HistoryList';
import UserBoard from './UserBoard';
import documentIcon from 'images/document.png';
import wordIcon from 'images/word.png';
import pdfIcon from 'images/pdf.png';
import winrarIcon from 'images/winrar.png';

library.add(faTv, faCopy, faUserCircle, faChartLine, faFileInvoiceDollar, faClock);

const numberWithCommas = x => {
  const parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

const mappingIconType = (type) => {
  switch (type) {
    case 'doc':
    case 'docx':
      return wordIcon;
    case 'pdf':
      return pdfIcon;
    case 'rar':
      return winrarIcon;
    default: 
      return documentIcon;
  }
}

const dataRight2 = [
  {
    title: 'Admin hỗ trợ 24/24',
  },
  {
    title: 'Quảng cáo',
  },
];

const mappingTransactionType = {
  RECHARGE: 'Nạp tiền',
  PURCHASE: 'Mua tài liệu',
};

/* eslint-disable react/prefer-stateless-function */
export class UserInformation extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      user: null,
      error: '',
      tab: 1,
    };
  }

  componentWillMount() {
    // get user information
    this.props.getUserDetails(getUser().id)
  }

  renderContent(tab) {
    console.log(this.props.download.toJS());
    switch (tab) {
      case 1:
        return <GeneralInformation user={this.props.user} />;
      case 2:
        return (
          <HistoryList
            name="download-history"
            renderHeader={() => (
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tài liệu</th>
                  <th>Ngày tải</th>
                </tr>
              </thead>
            )}
            renderData={() => (
              <tbody>
                {this.props.download.map((i, idx) => (
                  <tr key={i.get('id')}>
                    <td>{idx + 1}</td>
                    <td className="list-item-name">
                      <span>
                        <img src={mappingIconType(i.get('docName').split('.').pop())} width="15px" alt="document-type-icon" />
                      </span>
                      <span>
                        <Link to={`/tai-lieu/${i.get('docId')}`}>{i.get('docName')}</Link>
                      </span>
                    </td>
                    <td className="list-item-created-at">
                      <FontAwesomeIcon className={'info-icon'} icon={['far', 'clock']} style={{ marginRight: '5px' }} />
                      {moment(i.get('createdAt', '')).format('DD/MM/YYYY')}
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          />
        );
      case 3:
        return (
          <HistoryList
            name="upload-history"
            renderHeader={() => (
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tài liệu</th>
                  <th>Ngày đăng</th>
                </tr>
              </thead>
            )}
            renderData={() => (
              <tbody>
                {this.props.upload.map((i, idx) => (
                  <tr key={i.get('id')}>
                    <td>{idx + 1}</td>
                    <td className="list-item-name">
                      <span>
                        <img src={mappingIconType(i.get('name').split('.').pop())} width="15px" alt="document-type-icon" />
                      </span>
                      <span>
                        <Link to={`/tai-lieu/${i.get('id')}`}>{i.get('name')}</Link>
                      </span>
                    </td>
                    <td className="list-item-created-at">
                      <FontAwesomeIcon className={'info-icon'} icon={['far', 'clock']} style={{ marginRight: '5px' }} />
                      {moment(i.get('createdAt', '')).format('DD/MM/YYYY')}
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          />
        );
      case 4:
        return <div>Tài liệu đã lưu</div>;
      case 5:
        return (
          <HistoryList
            name="transaction-history"
            renderHeader={() => (
              <thead>
                <tr>
                  <th>#</th>
                  <th>Loại giao dịch</th>
                  <th>Tài liệu</th>
                  <th>Số tiền</th>
                  <th>Ngày giao dịch</th>
                </tr>
              </thead>
            )}
            renderData={() => (
              <tbody>
                {this.props.history.map((i, idx) => (
                  <tr key={i.get('id')}>
                    <td>{idx + 1}</td>
                    <td>{mappingTransactionType[i.get('action')]}</td>
                    <td>
                      {i.get('action') === 'PURCHASE'
                        && <Link to={`/tai-lieu/${i.get('docId')}`}>{i.get('docName')}</Link>}
                    </td>
                    <td>
                      {numberWithCommas(i.get('money', 0))}
                    </td>
                    <td className="list-item-created-at">
                      <FontAwesomeIcon className={'info-icon'} icon={['far', 'clock']} style={{ marginRight: '5px' }} />
                      {moment(i.get('createdAt', '')).format('DD/MM/YYYY')}
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          />
        );
      default:
        return null;
    }
  }

  render() {
    if (!getToken()) {
      return <Redirect to='/' />;
    }
    const contentLeft = (
      <div>
        <UserBoard user={this.props.user} />
        <SideNav
          items={[
            {
              tab: 1,
              text: 'Tổng quan',
              icon: <FontAwesomeIcon className="user-icon" icon={['fas', 'tv']} size="lg" />
            },
            {
              tab: 2,
              text: 'Tài liệu đã tải',
              icon: <FontAwesomeIcon className="user-icon" icon={['far', 'copy']} size="lg" />
            },
            {
              tab: 3,
              text: 'Tài liệu đã đăng',
              icon: <FontAwesomeIcon className="user-icon" icon={['fas', 'file-invoice-dollar']} size="lg" />
            },
            {
              tab: 4,
              text: 'Tài liệu đã lưu',
              icon: <FontAwesomeIcon className="user-icon" icon={['far', 'user-circle']} size="lg" />
            },
            {
              tab: 5,
              text: 'Lịch sử giao dịch',
              icon: <FontAwesomeIcon className="user-icon" icon={['fas', 'chart-line']} size="lg" />
            },
          ]}
          currentTab={this.state.tab}
          onClick={(tab) => this.setState({ tab })}
        />
      </div>
    );

    const contentRight2 = (<div>
      {
        dataRight2.map((item, index) => {
          const ComponentRendered = item.component;
          return (<Tab
            className="green-tab"
            key={`right2-${index}`}
            style={{ background: 'white' }}
            title={item.title}
            content={
              ComponentRendered ? <ComponentRendered data={item.data} /> : null
            }
          />)
        })
      }
    </div>);
  
    return (
      <article>
        <Helmet>
          <title>Home Page</title>
          <meta
            name="description"
            content="DethiTHPT"
          />
        </Helmet>
        <div style={{ marginTop: '20px' }}>
          <Layout content={[
            {
              children: contentLeft,
              className: 'md-column',
            },
            { 
              children: (
                <div style={{ width: '100%', minHeight: '200px' }}>
                  <Tab
                    key="user-information"
                    title="Trang cá nhân"
                    content={
                      <Wrapper>
                        {this.props.user ? this.renderContent(this.state.tab) : null}
                      </Wrapper>
                    }
                    className="grey-box"
                    customTitle={
                      <GreyTitle className="custom-title center">
                        Trang cá nhân
                      </GreyTitle>
                    }
                    style={{ background: 'white' }}
                  >
                  </Tab>
                </div>
              ),
              className: 'lg-column',
            },
            { 
              children: contentRight2,
              className: 'sm-column',
            },
          ]} />
        </div>
      </article>
    );
  }
}

UserInformation.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  repos: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  onSubmitForm: PropTypes.func,
  username: PropTypes.string,
  onChangeUsername: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    getUserDetails: (id) => dispatch(getUserDetails(id)),
  };
}

const mapStateToProps = createStructuredSelector({
  user: makeSelectUser(),
  history: makeSelectHistory(),
  download: makeSelectDownload(),
  upload: makeSelectUpload(),
  loading: makeSelectLoading(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'userInformation', reducer });
const withSaga = injectSaga({ key: 'userInformation', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(UserInformation);
