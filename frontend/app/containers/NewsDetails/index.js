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
import _ from 'lodash';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import Tab from 'components/Tab';
import LoadingIndicator from 'components/LoadingIndicator';
import { getNewsDetails } from './actions';
import {
  makeSelectNews,
  makeSelectLoading,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
import Wrapper from './Wrapper';

const errorMapping = {
  unknown_error_download: 'Tài liệu không còn tồn tại hoặc có lỗi, vui lòng báo lại cho admin!',
  not_enough_money: 'Tài khoản không còn đủ tiền để thanh toán, vui lòng nạp thêm!',
}

/* eslint-disable react/prefer-stateless-function */
export class NewsDetails extends React.PureComponent {
  constructor() {
    super();
    this.state = {};
  }

  componentWillMount() {
    window.scrollTo(0, 0);
    if (this.props.match.params.id) {
      this.props.getNewsDetails(this.props.match.params.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id) {
      this.props.getNewsDetails(nextProps.match.params.id);
    }
  }

  render() {
    const { news } = this.props;
    return (
      <Wrapper>
        <Helmet>
          <title>Tin tức</title>
          <meta name="description" content="Tin tức" />
        </Helmet>
        <Tab
          key="tin-tuc-chi-tiet"
          style={{ background: 'white' }}
          title={'Tin tức'}
          className="doc-details"
          content={
            this.props.loading ? (
              <LoadingIndicator />
            ) : (
            !_.isEmpty(news) ? (
            <div style={{ padding: "0px 20px 10px" }}>
              <div className={`error-document ${this.props.message && 'show'}`}>
                {errorMapping[this.props.message] || 'Có lỗi xảy ra, vui lòng báo lại cho admin!'}
              </div>
              <div className="doc-title">
                <p>{_.get(news, 'name')}</p>
              </div>
              <div className="doc-category" dangerouslySetInnerHTML={{ __html: news.text }}>
              </div>
            </div>) : null)
          }
        />
      </Wrapper> 
    );
  }
}
NewsDetails.propTypes = {
  loading: PropTypes.bool,
};

export function mapDispatchToProps(dispatch) {
  return {
    getNewsDetails: (id) => dispatch(getNewsDetails(id)),
  };
}

const mapStateToProps = createStructuredSelector({
  news: makeSelectNews(),
  loading: makeSelectLoading(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'newsDetails', reducer });
const withSaga = injectSaga({ key: 'newsDetails', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(NewsDetails);
