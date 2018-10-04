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
import { Switch, Route, Link, Redirect } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faFolder } from '@fortawesome/free-solid-svg-icons';
import { faMoneyBillAlt } from '@fortawesome/free-regular-svg-icons';
import UploadDocument from 'containers/UploadDocument/Loadable';
import DocumentDetails from 'containers/DocumentDetails/Loadable';
import NewsDetails from 'containers/NewsDetails/Loadable';
import Category from 'containers/Category/Loadable';
import Payment from 'containers/Payment/Loadable';
import SearchResult from 'containers/SearchResult/Loadable';
import _ from 'lodash';
import FileSaver from 'file-saver';

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
import TagList from 'components/TagList';
import { getUser, setToken } from 'services/auth';
import {
  login,
  updateUserInfo,
  getDocumentsList,
  getCategories,
  getCollections,
  getTags,
  getNews,
  requestDownload,
  removeFileSave,
  removeMessage,
} from './actions';
import {
  makeSelectUser,
  makeSelectToken,
  makeSelectLoading,
  makeSelectDocuments,
  makeSelectCategories,
  makeSelectCollections,
  makeSelectTags,
  makeSelectNews,
  makeSelectFile,
  makeSelectMessage,
  makeSelectQueryCollection,
} from './selectors';
import { makeSelectCurrentUser, makeSelectPopout } from 'containers/App/selectors';
import { clearData, getUserDetail } from 'containers/App/actions';
import reducer from './reducer';
import saga from './saga';
import CreateUserForm from '../Login/Form';
import GreyTitle from './GreyTitle';
import HomeWrapper from './Wrapper';
import UserDashboard from './UserDashboard';
import Button from './Button';

library.add(faMoneyBillAlt, faFolder, faCog);

const dataRight2 = [
  {
    title: 'Admin hỗ trợ 24/24',
  },
  {
    title: 'Quảng cáo',
  },
];

const numberWithCommas = x => {
  const parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};
const itemsPerLoad = 10;
const requiredFields = [
  'name',
  'phone',
  'bod',
  'position',
  'city',
  'district',
  'level',
  'school',
];
const validate = (input, req) => req.find(f => !input[f]);

const errorMapping = {
  unknown_error_download: 'Tài liệu không còn tồn tại hoặc có lỗi, vui lòng báo lại cho admin!',
  not_enough_money: 'Tài khoản không còn đủ tiền để thanh toán, vui lòng nạp thêm!',
}

const dataConvert = ['city', 'district', 'level', 'school'];

/* eslint-disable react/prefer-stateless-function */
export class HomePage extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      user: null,
      error: '',
      downloadingFile: '',
    };
    this.onLogin = this.onLogin.bind(this);
    this.onLogout = this.onLogout.bind(this);
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
    this.props.getCollections(this.props.queryCollection);
    // get tags
    this.props.getTags();
    // get news
    this.props.getNews();

    this.unlisten = this.props.history.listen((location, action) => {
      if (location.pathname === '/') {
        this.props.getDocumentsList({
          sort: 'createdAt.desc',
          size: itemsPerLoad,
        });
      }
    });
    const user = getUser();
    if (user) {
      this.props.getUserDetail(user.id);
    }
  }

  componentWillUnmount() {
    this.unlisten();
    this.props.removeMessage();
  }

  componentWillReceiveProps(nextProps) {
    // After login but not enought information to register
    if (!_.isEqual(this.props.user, nextProps.user)) {
      this.setState({ user: nextProps.user });
    }
    // After get file download
    if (!this.props.file && nextProps.file && this.props.history.location.pathname === '/') {
      const blob = new Blob([nextProps.file]);
      FileSaver.saveAs(blob, _.get(this.state, 'downloadingFile', 'download'));
      this.setState({ downloadingFile: '' });
      this.props.removeFileSave();
    }
    // If any error from request
    if (!this.props.message && nextProps.message && this.props.history.location.pathname === '/') {
      if (nextProps.message === 'registered_phone_number') {
        this.setState({ error: 'Số điện thoại đã được sử dụng để đăng ký' });
        const formError = document.querySelector('.form-header');
        formError.scrollIntoView();
        return;
      }
      alert(errorMapping[nextProps.message] || 'Có lỗi xảy ra, vui lòng báo lại cho admin!');
      this.props.removeMessage();
    }

    if (
      this.props.queryCollection &&
      !_.isEqual(this.props.queryCollection, nextProps.queryCollection)
    ) {
      // get document's collections
      this.props.getCollections(nextProps.queryCollection);
    }
  }

  onLogin(data) {
    this.props.onLogin(data);
  }

  onLogout() {
    const gapiInstance = window.gapi.auth2.getAuthInstance();
    if (gapiInstance.isSignedIn.get()) {
      gapiInstance.signOut();
      setToken();
      this.props.history.push('/');
    };
  }

  onChange(e) {
    const { name, value } = e.currentTarget;
    let updateUser;
    if (dataConvert.includes(name)) {
      const text = e.currentTarget.options[e.currentTarget.selectedIndex].innerHTML;
      updateUser = {
        ...this.state.user,
        [name]: {
          value,
          text: value ? text : '',
        },
      };
    } else {
      updateUser = {
        ...this.state.user,
        [name]: value,
      };
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
        error: 'Bạn cần điền đủ những thông tin bắt buộc',
      });
      const formError = document.querySelector('.form-header');
      formError.scrollIntoView();
    } else {
      delete update.exp;
      delete update.iat;
      delete update.id;
      delete update.status;
      update.role = 'member';
      dataConvert.forEach((key) => {
        update[key] = update[key].text;
      })
      this.props.onSubmitUserInfo(update, this.props.token);
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
    const { pathname } = this.props.history.location;
    const dataRight1 = [
      {
        title: 'Xu hướng từ khóa',
        component: TagList,
        data: this.props.tags,
        handleClickItem: tag => this.props.history.push(`/tim-kiem?q=${tag}`),
      },
      {
        title: 'Thống kê',
      },
      {
        title: 'Thông tin website',
      },
    ];
    const user = getUser();
    const contentLeft = (
      <div>
        {!user ? (
          <UserDashboard className="user-login">
            <FacebookLogin onLogin={this.onLogin}>
              <SocialButton
                text="Đăng nhập bằng facebook"
                background="blue"
                className="social-btn"
              />
            </FacebookLogin>
            <GoogleLogin onLogin={this.onLogin}>
              <SocialButton
                text="Đăng nhập bằng google"
                background="red"
                className="social-btn"
              />
            </GoogleLogin>
          </UserDashboard>
        ) : (
          <UserDashboard className="user-dashboard">
            <p className="user-email">{user.email}</p>
            <p className="user-page-link">
              <Link to="/trang-ca-nhan">(Trang cá nhân)</Link>
            </p>
            <p className="user-payment">
              <FontAwesomeIcon
                className="user-icon"
                icon={['far', 'file-alt']}
              />
              Số dư :{' '}
              <span className="red bold">{numberWithCommas(_.get(this.props.userDetail, 'money', 0))}</span>đ (HSD:{' '}
              <span className="green bold">5</span> ngày)
            </p>
            <p className="user-payment">
              <FontAwesomeIcon className="user-icon" icon={['fas', 'folder']} />
              Đã tải: <span className="bold">{_.get(this.props.userDetail, 'numOfDownloaded', 0)}</span> tài liệu (<Link to="/">
                Chi tiết
              </Link>)
            </p>
            <p className="user-payment">
              <FontAwesomeIcon className="user-icon" icon={['fas', 'cog']} />
              Đã đăng: <span className="bold">{_.get(this.props.userDetail, 'numOfUploaded', 0)}</span> tài liệu (<Link to="/">
                Chi tiết
              </Link>)
            </p>
            <div className="control-btns">
              <Button color="#D9534F">Nạp tiền</Button>
              <Button
                onClick={() => this.props.history.push('/dang-ban-tai-lieu')}
                color="#5CB85C"
              >
                Đăng tài liệu
              </Button>
              <Button onClick={this.onLogout} color="blue">
                Đăng xuất
              </Button>
            </div>
          </UserDashboard>
        )}
        <Tab
          key="danh-muc-tai-lieu"
          title="Danh mục tài liệu"
          content={
            <List
              items={this.props.categories}
              component={({ item }) => (
                <TabList
                  item={{
                    link: `/danh-muc/${item.id}`,
                    title: item.name,
                    quantity: item.numDocRefs,
                    active: pathname.includes('danh-muc') && pathname.split('/').pop() === item.id ? true : false,
                  }}
                  type={LIST_COLOR}
                />
              )}
            />
          }
        />
      </div>
    );
    const contentRight1 = (
      <div>
        <Tab
          key="bo-suu-tap"
          style={{ background: 'white' }}
          title="Bộ sưu tập nổi bật"
          content={
            <List
              items={this.props.collections.sort((a, b) => b.numDocRefs - a.numDocRefs)}
              component={({ item }) => (
                <TabList
                  item={{
                    link: `/bo-suu-tap/${item.id}`,
                    title: item.name,
                    quantity: item.numDocRefs || 0,
                  }}
                />
              )}
            />
          }
        />
        <Tab
          key="tin-tuc"
          title="Tin tức nổi bật"
          content={
            <List
              items={this.props.news}
              component={({ item }) => (
                <TabList
                  item={{
                    link: `/tin-tuc/${item.id}`,
                    title: item.name,
                  }}
                  type={LIST_COLOR}
                />
              )}
            />
          }
        />
        {dataRight1.map((item, index) => {
          const ComponentRendered = item.component;
          return (
            <Tab
              key={`right1-${index}`}
              style={{ background: 'white' }}
              title={item.title}
              content={
                ComponentRendered ? (
                  <ComponentRendered
                    items={item.data}
                    handleClickItem={item.handleClickItem}
                    selectedTag={
                      this.props.location.pathname === '/tim-kiem' &&
                      this.props.location.search.split('=')[1]
                    }
                  />
                ) : null
              }
            />
          );
        })}
      </div>
    );

    const contentRight2 = (
      <div>
        {dataRight2.map((item, index) => {
          const ComponentRendered = item.component;
          return (
            <Tab
              className="green-tab"
              key={`right2-${index}`}
              style={{ background: 'white' }}
              title={item.title}
              content={
                ComponentRendered ? (
                  <ComponentRendered data={item.data} />
                ) : null
              }
            />
          );
        })}
      </div>
    );

    return (
      <article>
        <Helmet>
          <title>Home Page</title>
          <meta name="description" content="DethiTHPT" />
        </Helmet>
        <div style={{ marginTop: '20px' }}>
          <Layout
            content={[
              {
                children: contentLeft,
                className: 'md-column',
              },
              {
                children: (
                  <div style={{ width: '100%', minHeight: '200px' }}>
                    <Switch>
                      <Route
                        exact
                        path="/"
                        component={() => (
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
                            />
                            <Tab
                              key="latest-docs"
                              title="Tài liệu mới đăng"
                              className="grey-box"
                              customTitle={
                                <GreyTitle className="custom-title">
                                  <p>Tài liệu mới đăng</p>
                                  <p>
                                    Hôm nay có{' '}
                                    <span className="bold">
                                      {this.props.documents.total}
                                    </span>{' '}
                                    tài liệu mới
                                  </p>
                                </GreyTitle>
                              }
                              content={
                                <div>
                                  <div className="content-docs">
                                    Website hiện có{' '}
                                    <span className="red bold">
                                      {this.props.documents.total}
                                    </span>{' '}
                                    tài liệu
                                  </div>
                                  <List
                                    items={this.props.documents.data}
                                    component={ListItem}
                                    loadMore={
                                      this.props.documents.data.length <
                                      this.props.documents.total
                                    }
                                    onLoadMore={this.loadMoreDocs}
                                    onDownload={(id, name) => {
                                      this.setState({ downloadingFile: name });
                                      this.props.requestDownload(id);
                                    }}
                                  />
                                </div>
                              }
                            />
                          </HomeWrapper>
                        )}
                      />
                      <Route
                        exact
                        path="/dang-ban-tai-lieu"
                        component={UploadDocument}
                      />
                      <Route
                        exact
                        path="/tai-lieu/:id"
                        component={DocumentDetails}
                      />
                      <Route
                        exact
                        path="/tin-tuc/:id"
                        component={NewsDetails}
                      />
                      <Route exact path="/danh-muc/:id" component={Category} />
                      <Route exact path="/tim-kiem" component={SearchResult} />
                      {/* <Route exact path="/thanh-toan/:id" component={Payment} /> */}
                      <Route path="" component={() => <Redirect to="/404" />} />
                    </Switch>
                  </div>
                ),
              },
              {
                children: contentRight1,
                className: 'md-column',
              },
              {
                children: contentRight2,
                className: 'sm-column',
              },
            ]}
          />
          <PopUp
            show={this.state.user}
            onClose={() => this.setState({ showCreateUserForm: false })}
            content={
              <CreateUserForm
                error={this.state.error}
                data={this.state.user}
                onSubmit={this.onSubmit}
                onChange={this.onChange}
              />
            }
          />
          {this.props.popout && (<PopUp
            show={this.props.popout}
            close
            onClose={() => this.props.clearData()}
            content={
              <div
                style={{ padding: '10px' }}
                dangerouslySetInnerHTML={{ __html: this.props.userDetail.notifyText }}
              />
            }
          />)}
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
  getTags: PropTypes.func,
  tags: PropTypes.array,
};

export function mapDispatchToProps(dispatch) {
  return {
    onLogin: payload => dispatch(login(payload)),
    onSubmitUserInfo: (payload, token) => dispatch(updateUserInfo(payload, token)),
    getDocumentsList: query => dispatch(getDocumentsList(query)),
    getCategories: () => dispatch(getCategories()),
    getCollections: queryCollection =>
      dispatch(getCollections(queryCollection)),
    getTags: () => dispatch(getTags()),
    getNews: () => dispatch(getNews()),
    requestDownload: id => dispatch(requestDownload(id)),
    removeFileSave: () => dispatch(removeFileSave()),
    removeMessage: () => dispatch(removeMessage()),
    clearData: () => dispatch(clearData()),
    getUserDetail: (id) => dispatch(getUserDetail(id)),
  };
}

const mapStateToProps = createStructuredSelector({
  user: makeSelectUser(),
  loading: makeSelectLoading(),
  documents: makeSelectDocuments(),
  categories: makeSelectCategories(),
  collections: makeSelectCollections(),
  tags: makeSelectTags(),
  news: makeSelectNews(),
  file: makeSelectFile(),
  message: makeSelectMessage(),
  token: makeSelectToken(),
  userDetail: makeSelectCurrentUser(),
  popout: makeSelectPopout(),
  queryCollection: makeSelectQueryCollection(),
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
