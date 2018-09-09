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
import { Badge, Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';
import moment from 'moment';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { getCategories } from './actions';
import {
  makeSelectCategories,
  makeSelectLoading,
} from './selectors';
import reducer from './reducer';
import saga from './saga';

const itemsPerLoad = 10;

/* eslint-disable react/prefer-stateless-function */
export class Category extends React.PureComponent {
  constructor() {
    super();
    this.state = {};
  }

  componentWillMount() {
    // get categories
    this.props.getCategories();
  }

  renderCategoryRow(categories) {
    return categories.map((cate) => (
      <tr key={cate.id}>
          <th scope="row">{cate.id}</th>
          <td>{cate.name}</td>
          <td>{cate.description}</td>
          <td>{cate.userName}</td>
          <td>{cate.numDocRefs}</td>
          <td>{moment(cate.createdAt).format('DD/MM/YYYY')}</td>
      </tr>
    ))
  }

  render() {
    console.log(this.props.categories)
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Danh mục
              </CardHeader>
              <CardBody>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th scope="col">Id</th>
                      <th scope="col">Tên</th>
                      <th scope="col">Mô tả</th>
                      <th scope="col">Người tạo</th>
                      <th scope="col">Số tài liệu</th>
                      <th scope="col">Ngày tạo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.renderCategoryRow(this.props.categories)}
                    {/* {userList.map((user, index) =>
                      <UserRow key={index} user={user}/>
                    )} */}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

Category.propTypes = {
  loading: PropTypes.bool,
};

export function mapDispatchToProps(dispatch) {
  return {
    getCategories: () => dispatch(getCategories()),
  };
}

const mapStateToProps = createStructuredSelector({
  categories: makeSelectCategories(),
  loading: makeSelectLoading(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'category', reducer });
const withSaga = injectSaga({ key: 'category', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(Category);
