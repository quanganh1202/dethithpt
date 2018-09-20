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
import { getUsers } from './actions';
import {
  makeSelectUsers,
  makeSelectLoading,
} from './selectors';
import reducer from './reducer';
import saga from './saga';

const itemsPerLoad = 10;

const Wrapper = styled.div`
  table {
    tr > td, tr > th {
      white-space: nowrap;
    }
  }
`;

/* eslint-disable react/prefer-stateless-function */
export class User extends React.PureComponent {
  constructor() {
    super();
    this.state = {};
  }

  componentWillMount() {
    // get subjects
    this.props.getUsers();
  }

  renderUserRow(users) {
    return users.map((item) => (
      <tr key={item.id}>
          <th scope="row">{item.id}</th>
          <td>{moment(item.createdAt).format('DD/MM/YYYY')}</td>
          <td>{item.name}</td>
          <td>{item.email}</td>
          <td>{item.role}</td>
          <td>{item.phone}</td>
          <td>{item.bod}</td>
          <td>{item.school}</td>
          <td>{item.city}</td>
          <td>{item.download}</td>
          <td>{item.upload}</td>
          <td>{item.deposit}</td>
          <td>{item.amount}</td>
          <td>{item.group}</td>
          <td>{item.description}</td>
          <td>{item.userName}</td>
          <td></td>
      </tr>
    ))
  }

  render() {
    return (
      <Wrapper className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Breadcrumb>
              <BreadcrumbItem><Link to="/">Trang chủ</Link></BreadcrumbItem>
              <BreadcrumbItem active>Thành viên</BreadcrumbItem>
            </Breadcrumb>
          </Col>
        </Row>
        <Container fluid>
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify"></i> Thành viên
                  {/* <div className="float-right">
                    <Button
                      block
                      color="primary"
                      size="sm"
                      onClick={() => this.props.history.push('/users/create')}
                    >Tạo mới</Button>
                  </div> */}
                </CardHeader>
                <CardBody>
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Ngày tạo</th>
                        <th scope="col">Tên</th>
                        <th scope="col">Email</th>
                        <th scope="col">Bạn là</th>
                        <th scope="col">SĐT</th>
                        <th scope="col">Năm sinh</th>
                        <th scope="col">Trường</th>
                        <th scope="col">Thành phố</th>
                        <th scope="col">Đã tải</th>
                        <th scope="col">Đã đăng</th>
                        <th scope="col">Đã nạp</th>
                        <th scope="col">Số dư</th>
                        <th scope="col">Group</th>
                        <th scope="col">Ghi chú</th>
                        <th scope="col">Người tạo</th>
                        <th scope="col">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.renderUserRow(this.props.users)}
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

User.propTypes = {
  loading: PropTypes.bool,
};

export function mapDispatchToProps(dispatch) {
  return {
    getUsers: () => dispatch(getUsers()),
  };
}

const mapStateToProps = createStructuredSelector({
  users: makeSelectUsers(),
  loading: makeSelectLoading(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'user', reducer });
const withSaga = injectSaga({ key: 'user', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(User);
