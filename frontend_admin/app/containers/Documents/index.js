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
import checkIcon from 'assets/img/icons/check.png';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { getDocs, approveDocs } from './actions';
import {
  makeSelectDocuments,
  makeSelectLoading,
  makeSelectTotalUser,
} from './selectors';
import reducer from './reducer';
import saga from './saga';

const Wrapper = styled.div`
  table {
    font-size: 11px;
    tr > td {
      white-space: nowrap;
      &:nth-child(2) {
        white-space: normal;
        min-width: 150px;
      }
      > p {
        margin: 0;
      }
    }
    tr > th {
      white-space: nowrap;
    }
    thead > tr {
      font-size: 11px;
    }
  }
`;

/* eslint-disable react/prefer-stateless-function */
export class Documents extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      currentPage: 1,
    };
    this.size = 10;
    this.maxPages = 11;
    this.sort = this.sort.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.search = this.search.bind(this);
    this.onSelectPage = this.onSelectPage.bind(this);
  }

  componentWillMount() {
    // get docs
    this.props.getDocs({
      sort: 'createdAt.desc',
      offset: 0,
      size: this.size,
    });
  }

  renderDocumentRow(docs) {
    return docs.map((item, idx) => (
      <tr key={item.id}>
        <th scope="row">{idx + 1}</th>
        <td>{item.name}</td>
        <td>{item.cates && item.cates.map((i) => <p key={i.cateId}>{i.cateName}</p>)}</td>
        <td>{item.subjects && item.subjects.map((i) => <p key={i.subjectId}>{i.subjectName}</p>)}</td>
        <td>{item.classes && item.classes.map((i) => <p key={i.classId}>{i.className}</p>)}</td>
        <td>{item.yearSchools && item.yearSchools.map((i) => <p key={i}>{i}</p>)}</td>
        <td>{item.price}</td>
        <td>{item.totalPages}</td>
        <td>{item.view}</td>
        <td>{item.comment}</td>
        <td>{moment(item.createdAt).format('DD/MM/YYYY')}</td>
        <td>{item.group}</td>
        <td>{item.userName}</td>
        <td>
          <button onClick={() => this.props.approve(item.id)}>
            <img src={checkIcon} height="15px" alt="check-icon" />
          </button>
        </td>
        <td></td>
        <td>{item.id}</td>
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
    this.props.getDocs({
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
    this.props.getDocs({
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
      this.props.getDocs(query)
    }
  }

  render() {
    return (
      <Wrapper className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Breadcrumb>
              <BreadcrumbItem><Link to="/">Trang chủ</Link></BreadcrumbItem>
              <BreadcrumbItem active>Tài liệu</BreadcrumbItem>
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
                      <Input onChange={this.onSearch} type="text" id="search-table" name="search-table-document" />
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
                        <th scope="col">#</th>
                        <HeadSort
                          scope="col"
                          onClick={this.sort}
                          data-field="name"
                          sortField={this.state.sortField}
                          sortBy={this.state.sortBy}
                        >Tài liệu</HeadSort>
                        <th scope="col">Danh mục</th>
                        <th scope="col">Môn</th>
                        <th scope="col">Lớp</th>
                        <th scope="col">Năm học</th>
                        <HeadSort
                          scope="col"
                          onClick={this.sort}
                          data-field="price"
                          sortField={this.state.sortField}
                          sortBy={this.state.sortBy}
                        >Giá</HeadSort>
                        <HeadSort
                          scope="col"
                          onClick={this.sort}
                          data-field="totalPages"
                          sortField={this.state.sortField}
                          sortBy={this.state.sortBy}
                        >Trang</HeadSort>
                        <HeadSort
                          scope="col"
                          onClick={this.sort}
                          data-field="view"
                          sortField={this.state.sortField}
                          sortBy={this.state.sortBy}
                        >Lượt tải</HeadSort>
                        <th scope="col">Bình luận</th>
                        <HeadSort
                          scope="col"
                          onClick={this.sort}
                          data-field="createdAt"
                          sortField={this.state.sortField}
                          sortBy={this.state.sortBy}
                        >Ngày tạo</HeadSort>
                        <th scope="col">Group tạo</th>
                        <HeadSort
                          scope="col"
                          onClick={this.sort}
                          data-field="userName"
                          sortField={this.state.sortField}
                          sortBy={this.state.sortBy}
                        >Người tạo</HeadSort>
                        <th scope="col">Thao tác</th>
                        <th scope="col">Vị trí</th>
                        <th scope="col">Mã</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.renderDocumentRow(this.props.documents)}
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

Documents.propTypes = {
  loading: PropTypes.bool,
};

export function mapDispatchToProps(dispatch) {
  return {
    getDocs: (query) => dispatch(getDocs(query)),
    approve: (id) => dispatch(approveDocs(id)),
  };
}

const mapStateToProps = createStructuredSelector({
  documents: makeSelectDocuments(),
  total: makeSelectTotalUser(),
  loading: makeSelectLoading(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'document', reducer });
const withSaga = injectSaga({ key: 'document', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(Documents);
