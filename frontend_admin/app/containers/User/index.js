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
import { isEqual } from 'lodash';
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
  Badge,
} from 'reactstrap';
import moment from 'moment';
import styled from 'styled-components';
import { HeadSort, PaginationTable, HeadFilter } from 'components/Table';
import deleteIcon from 'assets/img/icons/delete.png';
import editIcon from 'assets/img/icons/edit.png';
import checkIcon from 'assets/img/icons/check.png';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { getUsers, getDataInit } from './actions';
import {
  makeSelectUsers,
  makeSelectLoading,
  makeSelectTotalUser,
  makeSelectDataInit,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
import local from './newLocal.json';

const itemsPerLoad = 10;

const Wrapper = styled.div`
  table {
    font-size: 11px;
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
      selectedUsers: [],
      filters: {
        level: [],
      },
    };
    this.size = 10;
    this.maxPages = 11;
    this.sort = this.sort.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.search = this.search.bind(this);
    this.onSelectPage = this.onSelectPage.bind(this);
    this.handleSelectUsers = this.handleSelectUsers.bind(this);
    this.onSelectFilter = this.onSelectFilter.bind(this);
  }

  componentWillMount() {
    // get Classes
    this.props.getDataInit();
    // get subjects
    this.props.getUsers({
      sort: 'createdAt.desc',
      offset: 0,
      size: this.size,
    });
  }

  handleSelectUsers(e) {
    const { name, value, checked } = e.currentTarget;
    if (value === 'all') {
      this.setState({
        selectedUsers: checked ? this.props.users.map((i) => i.id) : [],
      });
    } else {
      this.setState({
        selectedUsers: checked
          ? [ ...this.state.selectedUsers, value ]
          : this.state.selectedUsers.filter((i) => i !== value),
      });
    }
  }

  renderUserRow(users) {
    return users.map((item, idx) => (
      <tr key={item.id}>
        <th scope="row">{idx + 1}</th>
        <th>
          <input
            type="checkbox"
            name={`select-${item.id}`}
            value={item.id}
            onClick={this.handleSelectUsers}
            checked={this.state.selectedUsers.includes(item.id)}
          />
        </th>
        <td>{moment(item.createdAt).format('DD/MM/YYYY')}</td>
        <td>{item.name}</td>
        <td>{item.email}</td>
        <td>{item.role}</td>
        <td>{item.phone}</td>
        <td>{item.bod}</td>
        <td>{item.level}</td>
        <td>{item.school}</td>
        <td>{item.city}</td>
        <td>{item.download}</td>
        <td>{item.upload}</td>
        <td>{item.deposit}</td>
        <td>{item.money}</td>
        <td>{item.group}</td>
        <td>Ghi chu</td>
        <td>Ghi chu 2</td>
        <td>{item.status === 1
          ? <Badge style={{ fontSize: '11px' }} color="success">Active</Badge>
          : <Badge style={{ fontSize: '11px' }} color="warning">Pending</Badge>}</td>
        {/* <td>{item.userName}</td> */}
        <td className="actions-col">
          <div style={{ overflow: 'auto' }}>
            <button
              style={{ float: 'left', padding: '0', marginRight: '5px' }}
              onClick={() => this.props.deleteUser([item.id])}
              title="Xóa"
            >
              <img src={deleteIcon} height="15px" alt="delete-icon" />
            </button>
            <button
              style={{ float: 'left', padding: '0', marginRight: '5px' }}
              onClick={() => this.props.history.push(`/users/${item.id}`)}
              title="Sửa"
            >
              <img src={editIcon} height="15px" alt="edit-icon" />
            </button>
            <button
              style={{ float: 'left', padding: '0' }}
              onClick={() => {}}
              title="Block/Unblock thành viên"
            >
              <img src={checkIcon} height="15px" alt="check-icon" />
            </button>
          </div>
          <div>
            <button
              style={{ float: 'left', padding: '0' }}
              onClick={() => {}}
              title="Thêm, Sửa cột ghi chú"
            >
              <img src={''} height="15px" alt="icon" />
            </button>
            <button
              style={{ float: 'left', padding: '0' }}
              onClick={() => {}}
              title="Thêm sửa cột ghi chú 2"
            >
              <img src={''} height="15px" alt="icon" />
            </button>
            <button
              style={{ float: 'left', padding: '0', marginRight: '5px' }}
              onClick={() => {}}
              title="Xem lịch sử hoạt động thành viên"
            >
              <img src={''} height="15px" alt="icon" />
            </button>
          </div>
        </td>
        <td>{moment(item.updatedAt).format('hh:mm - DD/MM/YYYY')}</td>
      </tr>
    ));
  }

  sort(e) {
    const { field } = e.currentTarget.dataset;
    let sortField = field;
    let sortBy = 'desc';
    if (this.state.sortField && this.state.sortField === field) {
      sortBy = this.state.sortBy === 'desc' ? 'asc' : 'desc';
    }
    this.setState({ sortField, sortBy });
    const query = {
      sort: `${sortField}.${sortBy}`,
      name: this.state.keyword || '',
      size: this.size,
      offset: this.size * (this.state.currentPage - 1),
    };
    Object.keys(filters).forEach((k) => (query[k] = filters[k].join()));
    this.props.getUsers(query);
  }

  onSearch(e) {
    this.setState({ keyword: e.currentTarget.value });
  }

  search() {
    this.setState({
      sortField: '',
      sortBy: '',
      currentPage: 1,
      filters: {
        level: [],
      },
    });
    this.props.getUsers({
      name: this.state.keyword,
      size: this.size,
      offset: 0,
    });
  }

  onSelectPage(page) {
    if (this.state.currentPage !== page) {
      const { sortField, sortBy, filters } = this.state;
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
      Object.keys(filters).forEach((k) => (query[k] = filters[k].join()));
      this.props.getUsers(query);
    }
  }

  onSelectFilter(e) {
    const { name } = e.currentTarget;
    const selected = Array.from(e.currentTarget.selectedOptions).map((o) => o.value);
    const newFilter = {
      ...this.state.filters,
      [name]: selected,
    };
    this.setState({
      filters: newFilter,
      currentPage: 1,
    });
    const query = {
      name: this.state.keyword,
      sort: 'createdAt.desc',
      size: this.size,
      offset: 0,
    };
    Object.keys(newFilter).forEach((k) => (query[k] = newFilter[k].join()));
    this.props.getUsers(query);
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
                      <Input onChange={this.onSearch} type="text" id="search-table" name="search-table-user" bsSize="sm" />
                      <InputGroupAddon addonType="append">
                        <Button type="button" onClick={this.search} size="sm">Tìm kiếm</Button>
                      </InputGroupAddon>
                    </InputGroup>
                  </Col>
                  {/* <div className="float-right">
                    <Buttoncheckbox
                      block
                      color="primary"
                      size="sm"
                      onClick={() => this.props.history.push('/users/create')}
                    >Tạo mới</Button>
                  </div> */}
                </CardHeader>
                <CardBody>
                  <Table responsive hover striped>
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">
                          <input
                            type="checkbox"
                            value="all"
                            name="select"
                            onChange={this.handleSelectUsers}
                            checked={isEqual(this.state.selectedUsers, this.props.users.map((i) => i.id))}
                          />
                        </th>
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
                        <HeadFilter
                          selectName="role"
                          multiple
                          scope="col"
                          options={[
                            { value: 'admin', label: 'admin' },
                            { value: 'student', label: 'student' },
                          ]}
                          onSelect={this.onSelectFilter}
                          value={this.state.filters.role || ''}
                        >
                          Bạn là
                        </HeadFilter>
                        <th scope="col">SĐT</th>
                        <HeadFilter
                          selectName="bod"
                          multiple
                          scope="col"
                          options={Array(81)
                            .fill((new Date()).getFullYear() - 80)
                            .map((y, idx) => ({ value: y + idx, label: y + idx }))}
                          onSelect={this.onSelectFilter}
                          value={this.state.filters.bod || ''}
                        >
                          Năm sinh
                        </HeadFilter>
                        <HeadFilter
                          selectName="level"
                          multiple
                          scope="col"
                          options={this.props.dataInit.classes.map(v => ({ value: v.id, label: v.name }))}
                          onSelect={this.onSelectFilter}
                          value={this.state.filters.level || ''}
                        >
                          Lớp
                        </HeadFilter>
                        <HeadFilter
                          selectName="school"
                          multiple
                          scope="col"
                          options={[
                            { value: 'Quang Trung', label: 'Quang Trung' },
                          ]}
                          onSelect={this.onSelectFilter}
                          value={this.state.filters.school || ''}
                        >
                          Trường
                        </HeadFilter>
                        <HeadFilter
                          selectName="city"
                          multiple
                          scope="col"
                          options={local.map((city) => ({ label: city.name, value: city.code}))}
                          onSelect={this.onSelectFilter}
                          value={this.state.filters.city || ''}
                        >
                          Thành phố
                        </HeadFilter>
                        <th scope="col">Đã tải</th>
                        <th scope="col">Đã đăng</th>
                        <th scope="col">Đã nạp</th>
                        <th scope="col">Số dư</th>
                        <HeadFilter
                          selectName="group"
                          multiple
                          scope="col"
                          options={[
                            { value: 'group1', label: 'group1' },
                            { value: 'group2', label: 'group2' },
                          ]}
                          onSelect={this.onSelectFilter}
                          value={this.state.filters.group || ''}
                        >
                          Group
                        </HeadFilter>
                        <th scope="col">Ghi chú</th>
                        <HeadFilter
                          selectName="description2"
                          multiple
                          scope="col"
                          options={[]}
                          onSelect={this.onSelectFilter}
                          value={this.state.filters.description2 || ''}
                        >
                          Ghi chú 2
                        </HeadFilter>
                        <HeadFilter
                          selectName="status"
                          multiple
                          scope="col"
                          options={[
                            { value: 1, label: 'Active' },
                            { value: 2, label: 'Pending' },
                          ]}
                          onSelect={this.onSelectFilter}
                          value={this.state.filters.status || ''}
                        >
                          Trạng thái
                        </HeadFilter>
                        {/* <th scope="col">Người tạo</th> */}
                        <th scope="col">Thao tác&nbsp;&nbsp;&nbsp;</th>
                        <th scope="col">Hoạt động gần đây</th>
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
  getDataInit: PropTypes.func,
  dataInit: PropTypes.object,
};

export function mapDispatchToProps(dispatch) {
  return {
    getUsers: (query) => dispatch(getUsers(query)),
    getDataInit: () => dispatch(getDataInit()),
  };
}

const mapStateToProps = createStructuredSelector({
  users: makeSelectUsers(),
  total: makeSelectTotalUser(),
  loading: makeSelectLoading(),
  dataInit: makeSelectDataInit(),
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
