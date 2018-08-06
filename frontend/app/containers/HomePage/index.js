/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { LIST_COLOR } from 'utils/constants';
import {
  makeSelectRepos,
  makeSelectLoading,
  makeSelectError,
} from 'containers/App/selectors';
import Layout from 'components/Layout';
import Tab from 'components/Tab';
import TabList from 'components/Tab/TabList';
import List from 'components/List';
import { loadRepos } from '../App/actions';
import { changeUsername } from './actions';
import { makeSelectUsername } from './selectors';
import reducer from './reducer';
import saga from './saga';

const categoryItems = [
  {
    id: 1,
    title: "Đề thi thử THPT Quốc Gia",
    link: "",
    quantity: 4,
  },
  {
    id: 2,
    title: "Chuyên đề, bài tập, giáo án",
    link: "",
    quantity: 4,
  },
  {
    id: 3,
    title: "Đề thi thử THPT Quốc Gia",
    link: "",
    quantity: 4,
  },
  {
    id: 4,
    title: "Đề thi thử THPT Quốc Gia",
    link: "",
    quantity: 4,
  },
  {
    id: 5,
    title: "Đề thi thử THPT Quốc Gia",
    link: "",
    quantity: 4,
  },
];

const dataLeft = [
  {
    title: "Danh mục tài liệu",
    data: categoryItems,
  }
];
const dataRight1 = [
  {
    title: "Bộ sưu tập nổi bật",
    data: categoryItems,
    component: ({ data }) => <List items={data} component={({ item }) => <TabList item={item} />} />
  },
  {
    title: "Tin tức nổi bật",
  },
  {
    title: "Xu hướng từ khóa",
  },
  {
    title: "Thống kê",
  },
  {
    title: "Thông tin website",
  }
];


/* eslint-disable react/prefer-stateless-function */
export class HomePage extends React.PureComponent {
  /**
   * when initial state username is not null, submit the form to load repos
   */
  componentDidMount() {
    if (this.props.username && this.props.username.trim().length > 0) {
      this.props.onSubmitForm();
    }
  }

  render() {
    const { loading, error, repos } = this.props;
    const reposListProps = {
      loading,
      error,
      repos,
    };
    const contentLeft = <div>{dataLeft.map((item, index) => <Tab key={`left-${index}`} title={item.title} content={
      <List items={item.data} component={({ item }) => <TabList item={item} type={LIST_COLOR} />} />
    } />)}</div>;
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
            { children: <div>123</div> },
            {
              children: contentRight1,
            },
            { children: <div>123</div> },
          ]} />
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
    onChangeUsername: evt => dispatch(changeUsername(evt.target.value)),
    onSubmitForm: evt => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(loadRepos());
    },
  };
}

const mapStateToProps = createStructuredSelector({
  repos: makeSelectRepos(),
  username: makeSelectUsername(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
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
