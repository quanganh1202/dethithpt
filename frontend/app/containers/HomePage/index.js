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
import { faCog, faFolder } from '@fortawesome/free-solid-svg-icons';
import { faMoneyBillAlt } from '@fortawesome/free-regular-svg-icons';
import UploadDocument from 'containers/UploadDocument/Loadable';
import styled from 'styled-components';
import _ from 'lodash';

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
import { login, updateUserInfo, getDocumentsList } from './actions';
import {
  makeSelectUser,
  makeSelectLoading,
  makeSelectDocuments,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
import CreateUserForm from '../Login/Form';
import { getUser } from 'services/auth';

library.add(faMoneyBillAlt, faFolder, faCog);

const categoryItems = [
  {
    id: 1,
    title: 'Đề thi thử THPT Quốc Gia',
    link: '',
    quantity: 4,
  },
  {
    id: 2,
    title: 'Chuyên đề, bài tập, giáo án',
    link: '',
    quantity: 4,
  },
  {
    id: 3,
    title: 'Đề thi thử THPT Quốc Gia',
    link: '',
    quantity: 4,
  },
  {
    id: 4,
    title: 'Đề thi thử THPT Quốc Gia',
    link: '',
    quantity: 4,
  },
  {
    id: 5,
    title: 'Đề thi thử THPT Quốc Gia',
    link: '',
    quantity: 4,
  },
];

const dataLeft = [
  {
    title: 'Danh mục tài liệu',
    data: categoryItems,
  },
];
const dataRight1 = [
  {
    title: 'Bộ sưu tập nổi bật',
    data: categoryItems,
    component: ({ data }) => (
      <List items={data} component={({ item }) => <TabList item={item} />} />
    ),
  },
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

const UserDashboard = styled.div`
  &.user-dashboard {
    padding: 5px 10px;
    margin-bottom: 15px;
    a {
      text-decoration: none;
    }
    p {
      font-size: 0.9em;
      margin: 0;
      &.user-payment {
        text-align: left;
        .user-icon {
          margin-right: 5px;
        }
      }
    }
    text-align: center;
    & .user-email {
      color: orange;
    }
    & .user-page-link {
      margin-bottom: 10px;
      a {
        color: blue;
      }
    }
  }
  
  &.user-login {
    text-align: center;
    margin-bottom: 15px;
    .social-btn {
      padding: 5px 10px;
      width: 90%;
      margin: 0 auto 5px;
    }
  }
`;

/* eslint-disable react/prefer-stateless-function */
export class HomePage extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      user: null,
      formCreate: {}
    };
    this.onLogin = this.onLogin.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    this.props.getDocumentsList({ sortBy: 'createdAt.desc' });
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.user, nextProps.user)) {
      this.setState({ user: nextProps.user });
    }
  }

  onLogin(data) {
    this.props.onLogin(data);
  }

  onChange(e) {
    const { name, value } = e.currentTarget;
    this.setState({ user: {
      ...this.state.user,
      [name]: value,
    } });
  }

  onSubmit(e) {
    e.preventDefault();
    const update = _.cloneDeep(this.state.user);
    delete update.exp;
    delete update.iat;
    this.props.onSubmitUserInfo(update);
  }

  render() {
    const user = getUser();
    const { loading, error, repos } = this.props;
    const reposListProps = {
      loading,
      error,
      repos,
    };
    const contentLeft = (
      <div>
        {!user ? (
          <UserDashboard className={'user-login'}>
            <FacebookLogin onLogin={this.onLogin}>
              <SocialButton
                text={'Đăng nhập bằng facebook'}
                background={'blue'}
                className={'social-btn'}
              />
            </FacebookLogin>
            <GoogleLogin onLogin={this.onLogin}>
              <SocialButton
                text={'Đăng nhập bằng google'}
                background={'red'}
                className={'social-btn'}
              />
            </GoogleLogin>
          </UserDashboard>
        ) : (
          <UserDashboard className="user-dashboard">
            <p className="user-email">{user.email}</p>
            <p className="user-page-link"><Link to="/">(Trang cá nhân)</Link></p>
            <p className="user-payment">
              <FontAwesomeIcon className="user-icon" icon={['far', 'file-alt']} />
              Số dư : <span className="red bold">{numberWithCommas(50000)}</span>đ (HSD: <span className="green bold">5</span> ngày)
            </p>
            <p className="user-payment">
              <FontAwesomeIcon className="user-icon" icon={['fas', 'folder']} />
              Đã tải: <span className="bold">550</span> tài liệu (<Link to="/">Chi tiết</Link>)
            </p>
            <p className="user-payment">
              <FontAwesomeIcon className="user-icon" icon={['fas', 'cog']} />
              Đã đăng: <span className="bold">35</span> tài liệu (<Link to="/">Chi tiết</Link>)
            </p>
          </UserDashboard>
        )}
        {
          dataLeft.map((item, index) => 
            <Tab key={`left-${index}`} title={item.title} content={
              <List
                items={item.data}
                component={({ item }) => <TabList item={item} type={LIST_COLOR} />}
              />
            } />
          )
        }
      </div>
    );
    const contentRight1 = <div>
    {
      dataRight1.map((item, index) => {
        const ComponentRendered = item.component;
        return <Tab key={`right1-${index}`} style={{ background: 'white' }} title={item.title} content={
          ComponentRendered ? <ComponentRendered data={item.data} /> : null} />
      })
    }
    </div>;

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
            },
            { children: (
              <div>
                <Switch>
                  <Route exact path="/" component={() => (
                    <div>
                      <Tab
                        key="notifications"
                        title="Thông báo mới"
                        content={
                          <div>test</div>
                        }
                      >
                      </Tab>
                      <Tab
                        key="latest-docs"
                        title="Tài liệu mới đăng"
                        content={
                          <List
                            items={this.props.documents}
                            component={ListItem}
                          />
                        }
                      >
                      </Tab>
                    </div>
                  )} />
                  <Route exact path="/dang-ban-tai-lieu" component={UploadDocument} />
                </Switch>
              </div>
            ) },
            {
              children: contentRight1,
            },
            { children: <div>123</div> },
          ]} />
          <PopUp
            show={this.state.user}
            // show
            onClose={() => this.setState({ showCreateUserForm: false })}
            content={
              <CreateUserForm data={this.state.user} onSubmit={this.onSubmit} onChange={this.onChange} />
            }
          />
        </div>
      </article>
    );
  }
}

HomePage.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  repos: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  onSubmitForm: PropTypes.func,
  username: PropTypes.string,
  onChangeUsername: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onLogin: (payload) => dispatch(login(payload)),
    onSubmitUserInfo: (payload) => dispatch(updateUserInfo(payload)),
    getDocumentsList: (query) => dispatch(getDocumentsList(query)),
  };
}

const mapStateToProps = createStructuredSelector({
  user: makeSelectUser(),
  loading: makeSelectLoading(),
  documents: makeSelectDocuments(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'home', reducer });
const withSaga = injectSaga({ key: 'home', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(HomePage);
