/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
// import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import {
  Container,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
  Button,
} from 'reactstrap';
import moment from 'moment';
import styled from 'styled-components';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { getCategories } from './actions';
import {
  makeSelectCategories,
  makeSelectLoading,
} from './selectors';
import reducer from './reducer';
import saga from './saga';

const Wrapper = styled.div`
  table {
    font-size: 11px;
  }
`;

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
    return categories.map((cate, idx) => (
      <tr key={cate.id}>
          <th scope="row">{idx + 1}</th>
          <td><Link to={`/categories/${cate.id}`}>{cate.name}</Link></td>
          <td>{cate.description}</td>
          <td>{cate.userName}</td>
          <td>{cate.numDocRefs}</td>
          <td>{moment(cate.createdAt).format('DD/MM/YYYY')}</td>
      </tr>
    ));
  }

  render() {
    return (
      <Wrapper className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Breadcrumb>
              <BreadcrumbItem><Link to="/">Trang chủ</Link></BreadcrumbItem>
              <BreadcrumbItem active>Danh mục</BreadcrumbItem>
            </Breadcrumb>
          </Col>
        </Row>
        <Container fluid>
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify"></i> Danh mục
                  <div className="float-right">
                    <Button
                      block
                      color="primary"
                      size="sm"
                      onClick={() => this.props.history.push('/categories/create')}
                    >Tạo mới</Button>
                  </div>
                </CardHeader>
                <CardBody>
                  <Table responsive hover striped>
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Tên</th>
                        <th scope="col">Mô tả</th>
                        <th scope="col">Người tạo</th>
                        <th scope="col">Số tài liệu</th>
                        <th scope="col">Ngày tạo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.renderCategoryRow(this.props.categories)}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </Wrapper>
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
