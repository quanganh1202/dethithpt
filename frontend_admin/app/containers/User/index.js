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
  InputGroup,
  Input,
  InputGroupAddon,
} from 'reactstrap';
import moment from 'moment';
import styled from 'styled-components';
import { HeadSort, PaginationTable } from 'components/Table';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { getUsers } from './actions';
import {
  makeSelectUsers,
  makeSelectLoading,
  makeSelectTotalUser,
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
    this.state = {
      currentPage: 1,
    };
    this.size = 1;
    this.maxPages = 3;
    this.sort = this.sort.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.search = this.search.bind(this);
    this.onSelectPage = this.onSelectPage.bind(this);
  }

  componentWillMount() {
    // get subjects
    this.props.getUsers({
      sort: 'createdAt.desc',
      offset: 0,
      size: this.size,
    });
  }

  renderUserRow(users) {
    return users.map((item, idx) => (
      <tr key={item.id}>
          <th scope="row">{idx + 1}</th>
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

  sort(e) {
    const { field } = e.currentTarget.dataset;
    let sortField = field;
    let sortBy = 'desc';
    if (this.state.sortField && this.state.sortField === field) {
      sortBy = this.state.sortBy === 'desc' ? 'asc' : 'desc';
    }
    this.setState({ sortField, sortBy });
    this.props.getUsers({
      sort: `${sortField}.${sortBy}`,
      name: this.state.keyword || '',
      size: this.size,
      offset: this.size * (this.state.currentPage - 1),
    });
  }

  onSearch(e) {
    this.setState({ keyword: e.currentTarget.value });
  }

  search() {
    this.setState({
      sortField: '',
      sortBy: '',
      currentPage: 1,
    });
    this.props.getUsers({
      name: this.state.keyword,
      size: this.size,
      offset: 0,
    })
  }

  onSelectPage(page) {
    if (this.state.currentPage !== page) {
      const { sortField, sortBy } = this.state;
      this.setState({
        currentPage: page,
      });
      const query = {
        name: this.state.keyword || '',
        size: this.size,
        offset: this.size * (page - 1),
      };
      if (sortField) {
        query.sort = `${sortField}.${sortBy}`;
      }
      this.props.getUsers(query)
    }
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
                  <Col md="3">
                    <InputGroup>
                      <Input onChange={this.onSearch} type="text" id="search-table" name="search-table-user" />
                      <InputGroupAddon addonType="append">
                        <Button type="button" onClick={this.search}>Tìm kiếm</Button>
                      </InputGroupAddon>
                    </InputGroup>
                  </Col>
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
                        <HeadSort
                          scope="col"
                          onClick={this.sort}
                          data-field="createdAt"
                          sortField={this.state.sortField}
                          sortBy={this.state.sortBy}
                        >Ngày tạo</HeadSort>
                        <HeadSort
                          scope="col"
                          onClick={this.sort}
                          data-field="name"
                          sortField={this.state.sortField}
                          sortBy={this.state.sortBy}
                        >Tên</HeadSort>
                        <HeadSort
                          scope="col"
                          onClick={this.sort}
                          data-field="email"
                          sortField={this.state.sortField}
                          sortBy={this.state.sortBy}
                        >Email</HeadSort>
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
                  <PaginationTable
                    maxPages={this.maxPages}
                    total={this.props.total}
                    currentPage={this.state.currentPage}
                    size={this.size}
                    onClick={this.onSelectPage}
                  />
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
    getUsers: (query) => dispatch(getUsers(query)),
  };
}

const mapStateToProps = createStructuredSelector({
  users: makeSelectUsers(),
  total: makeSelectTotalUser(),
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
