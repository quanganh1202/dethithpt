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
import { Redirect } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTv, faChartLine, faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons';
import { faCopy, faUserCircle } from '@fortawesome/free-regular-svg-icons';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import Layout from 'components/Layout';
import Tab from 'components/Tab';
import {
  getUserDetails,
} from './actions';
import {
  makeSelectUser,
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
import UserBoard from './UserBoard';

library.add(faTv, faCopy, faUserCircle, faChartLine, faFileInvoiceDollar);

const dataRight1 = [
  {
    title: 'Tin tức nổi bật',
  },
  {
    title: 'Xu hướng từ khóa',
  },
  {
    title: 'Thống kê',
  },
  {
    title: 'Thông tin website',
  },
];

const dataRight2 = [
  {
    title: 'Admin hỗ trợ 24/24',
  },
  {
    title: 'Quảng cáo',
  },
];

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
    switch (tab) {
      case 1:
        return <GeneralInformation user={this.props.user} />;
      case 2:
        return <div>Tài liệu đã tải</div>;
      case 3:
        return <div>Tài liệu đã đăng</div>;
      case 4:
        return <div>Tài liệu đã lưu</div>;
      case 5:
        return <div>Lịch sử giao dịch</div>;
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
