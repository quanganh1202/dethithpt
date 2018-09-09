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
import Category from 'containers/Category/Loadable';
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
import {
  login,
  updateUserInfo,
  getDocumentsList,
  getCategories,
  getCollections,
} from './actions';
import {
  makeSelectUser,
  makeSelectLoading,
  makeSelectDocuments,
  makeSelectCategories,
  makeSelectCollections,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
import CreateUserForm from '../Login/Form';
import { getUser } from 'services/auth';
import GreyTitle from './GreyTitle';
import HomeWrapper from './Wrapper';
import UserDashboard from './UserDashboard';

library.add(faMoneyBillAlt, faFolder, faCog);

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
]

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
const itemsPerLoad = 10;
const requiredFields = ['name', 'phone', 'bod', 'role', 'city', 'district', 'level', 'school'];
const validate = (input, req) => {
  return req.find((f) => !input[f]);
}

/* eslint-disable react/prefer-stateless-function */
export class HomePage extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      user: null,
      error: '',
    };
    this.onLogin = this.onLogin.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.loadMoreDocs = this.loadMoreDocs.bind(this);
  }

  componentWillMount() {
    // get document list
    if (!this.props.documents.data.length) {
      this.props.getDocumentsList({
        sort: 'createdAt.desc',
        size: itemsPerLoad,
      });
    }
    // get document's categories
    this.props.getCategories();
    // get document's collections
    this.props.getCollections();

    this.unlisten = this.props.history.listen((location, action) => {
      if (location.pathname === '/') {
        this.props.getDocumentsList({
          sort: 'createdAt.desc',
          size: itemsPerLoad,
        });
      }
    });
  }

  componentWillUnmount() {
    this.unlisten();
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
    const updateUser = {
      ...this.state.user,
      [name]: value,
    }
    if (updateUser.facebook === null) {
      updateUser.facebook = '';
    }
    const error = validate(updateUser, requiredFields);
    this.setState({ user: updateUser, error: error ? this.state.error : '' });
  }

  onSubmit(e) {
    e.preventDefault();
    const update = _.cloneDeep(this.state.user);
    if (update.facebook === null) {
      update.facebook = '';
    }
    const error = validate(update, requiredFields);
    if (error) {
      this.setState({
        error: 'Bạn cần điền đủ những thông tin bắt buộc'
      })
      const formError = document.querySelector('.form-header');
      formError.scrollIntoView();
    } else {
      delete update.exp;
      delete update.iat;
      delete update.id;
      delete update.status;
      this.props.onSubmitUserInfo(update);
    }
  }

  loadMoreDocs() {
    this.props.getDocumentsList({
      sort: 'createdAt.desc',
      offset: this.props.documents.data.length,
      size: itemsPerLoad,
    });
  }

  render() {
    const user = getUser();
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
        <Tab key={`danh-muc-tai-lieu`} title={'Danh mục tài liệu'} content={
          <List
            items={this.props.categories}
            component={({ item }) => (
              <TabList
                item={{
                  link: `/danh-muc/${item.id}`,
                  title: item.name,
                  quantity: item.quantity || 4,
                }}
                type={LIST_COLOR}
              />
            )}
          />
        } />
      </div>
    );
    const contentRight1 = (<div>
      <Tab
        key={'bo-suu-tap'}
        style={{ background: 'white' }}
        title={'Bộ sưu tập nổi bật'}
        content={(
          <List
            items={this.props.collections}
            component={({ item }) => (
              <TabList
                item={{
                  link: `/bo-suu-tap/${item.id}`,
                  title: item.name,
                  quantity: item.quantity || 4,
                }}
              />
            )}
          />
        )}
      />
      {
        dataRight1.map((item, index) => {
          const ComponentRendered = item.component;
          return <Tab key={`right1-${index}`} style={{ background: 'white' }} title={item.title} content={
            ComponentRendered ? <ComponentRendered data={item.data} /> : null} />
        })
      }
    </div>);

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
            },
            { children: (
              <div>
                <Switch>
                  <Route exact path="/" component={() => (
                    <HomeWrapper>
                      <Tab
                        key="notifications"
                        title="Thông báo mới"
                        content={
                          <div className="content-notification">
                            Chúc các bạn ngày mới tốt lành !
                          </div>
                        }
                        className="grey-box"
                        customTitle={
                          <GreyTitle className="custom-title">
                            <p>Thông báo mới</p>
                          </GreyTitle>
                        }
                      >
                      </Tab>
                      <Tab
                        key="latest-docs"
                        title="Tài liệu mới đăng"
                        className="grey-box"
                        customTitle={
                          <GreyTitle className="custom-title">
                            <p>Tài liệu mới đăng</p>
                            <p>Hôm nay có <span className="bold">{this.props.documents.total}</span> tài liệu mới</p>
                          </GreyTitle>
                        }
                        content={
                          <div>
                            <div className="content-docs">
                              Website hiện có <span className="red bold">{this.props.documents.total}</span> tài liệu
                            </div>
                            <List
                              items={this.props.documents.data}
                              component={ListItem}
                              loadMore={this.props.documents.data.length < this.props.documents.total}
                              onLoadMore={this.loadMoreDocs}
                            />
                          </div>
                        }
                      >
                      </Tab>
                    </HomeWrapper>
                  )} />
                  <Route exact path="/danh-muc/:id" component={Category} />
                </Switch>
              </div>
            ) },
            {
              children: contentRight1,
            },
            { 
              children: contentRight2,
            },
          ]} />
          <PopUp
            show={this.state.user}
            onClose={() => this.setState({ showCreateUserForm: false })}
            content={
              <CreateUserForm error={this.state.error} data={this.state.user} onSubmit={this.onSubmit} onChange={this.onChange} />
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
    getCategories: () => dispatch(getCategories()),
    getCollections: () => dispatch(getCollections()),
  };
}

const mapStateToProps = createStructuredSelector({
  user: makeSelectUser(),
  loading: makeSelectLoading(),
  documents: makeSelectDocuments(),
  categories: makeSelectCategories(),
  collections: makeSelectCollections(),
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
