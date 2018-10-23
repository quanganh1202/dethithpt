/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
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
  Input,
  InputGroup,
  InputGroupAddon,
} from 'reactstrap';
import moment from 'moment';
import styled from 'styled-components';
import { PaginationTable, HeadFilter, HeadSort } from 'components/Table';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { getCollections, deleteCollections, clearProcessStatus, updateCollections, getDataInit } from './actions';
import {
  makeSelectCollections,
  makeSelectTotalCollection,
  makeSelectLoading,
  makeSelectProcessStatus,
  makeSelectDataInit,
} from './selectors';
import reducer from './reducer';
import saga from './saga';

const Wrapper = styled.div`
  table {
    font-size: 11px;
    tbody {
      tr > td {
        p {
          margin: 0;
        }
        &:nth-of-type(6), &:nth-of-type(5) {
          white-space: nowrap;
        }
      }
    }
  }
`;

const optionYear = Array(21)
  .fill((new Date()).getFullYear() - 20)
  .map((y, idx) => ({ value: y + idx, label: y + idx }));

/* eslint-disable react/prefer-stateless-function */
export class Collection extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      currentPage: 1,
      selectedCollections: [],
      collections: [],
      changedCollections: [],
      filters: {
        cateId: [],
        subjectId: [],
        classId: [],
        yearSchools: [],
      },
    };
    this.size = 10;
    this.maxPages = 11;
    this.handleSelectCollections = this.handleSelectCollections.bind(this);
    this.handleSavePosition = this.handleSavePosition.bind(this);
    this.handleChangePosition = this.handleChangePosition.bind(this);
    this.onSelectPage = this.onSelectPage.bind(this);
    this.sort = this.sort.bind(this);
    this.onSelectFilter = this.onSelectFilter.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.search = this.search.bind(this);
  }

  componentWillMount() {
    // get collections
    this.props.getCollections({
      sort: 'position.asc',
      offset: 0,
      size: this.size,
    });
    this.props.getDataInit();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.processStatus && !this.props.processStatus) {
      this.setState({
        selectedCollections: [],
        currentPage: 1,
      });
      this.props.getCollections({
        sort: 'position.asc',
        offset: 0,
        size: this.size,
      });
      this.props.clearProcessStatus();
    }
    if (!_.isEqual(nextProps.collections, this.props.collections)) {
      this.setState({
        collections: nextProps.collections,
      });
    }
  }

  componentWillUnmount() {
    this.props.clearProcessStatus(true);
  }

  onSelectPage(page) {
    if (this.state.currentPage !== page) {
      const { sortField, sortBy, filters } = this.state;
      this.setState({
        currentPage: page,
        selectedCollections: [],
      });
      const query = {
        sort: 'position.asc',
        offset: this.size * (page - 1),
        size: this.size,
      };
      if (sortField) {
        query.sort = `${sortField}.${sortBy}`;
      }
      Object.keys(filters).forEach((k) => (query[k] = filters[k].join()));
      this.props.getCollections(query);
    }
  }

  renderCollectionRow(collections) {
    if (!collections || !_.get(collections, 'length', 0)) {
      return (
        <tr>
          <td colSpan="15" style={{ textAlign: 'center' }}>Không tìm thấy bản ghi nào!</td>
        </tr>
      )
    }
    return collections.map((item, idx) => (
      <tr key={item.id}>
        <th scope="row">{((this.state.currentPage - 1) * this.size) + idx + 1}</th>
        <td>
          <input
            type="checkbox"
            name={`select-${item.id}`}
            value={item.id}
            onClick={this.handleSelectCollections}
            checked={this.state.selectedCollections.includes(item.id)}
          />
        </td>
        <td>
          <Link to={`/collections/${item.id}`}>{item.name}</Link>
        </td>
        <td>{item.description}</td>
        <td>{(item.cates || []).map((i) => <p key={i.cateId}>{i.cateName}</p>)}</td>
        <td>{(item.subjects || []).map((i) => <p key={i.subjectId}>{i.subjectName}</p>)}</td>
        <td>{(item.classes || []).map((i) => <p key={i.classId}>{i.className}</p>)}</td>
        <td>{(item.yearSchools || '').split(',').map((i) => <p key={i}>{i}</p>)}</td>
        <td>{item.userEmail}</td>
        <td>{moment(item.createdAt).format('DD/MM/YYYY')}</td>
        <td>{item.view}</td>
        <td>{item.numDocRefs}</td>
        <td style={{ textAlign: 'center' }}>
          <button
            onClick={() => this.props.updateCollections([{ id: item.id, priority: item.priority ? 0 : 1 }])}
            title="Nổi bật trang chủ"
          >
            <i className={`fa ${item.priority ? 'fa-check' : 'fa-close'} fa-lg`} aria-hidden="true"></i>
          </button>
        </td>
        <td style={{ textAlign: 'center' }}>
          <button
            onClick={() => this.props.updateCollections([{ id: item.id, priorityCate: item.priorityCate ? 0 : 1 }])}
            title="Nổi bật danh mục"
          >
            <i className={`fa ${item.priorityCate ? 'fa-check' : 'fa-close'} fa-lg`} aria-hidden="true"></i>
          </button>
        </td>
        <td>
          <input
            style={{ border: '1px solid #ccc', maxWidth: '50px'}}
            type="number"
            name={`position-item-${item.id}-${idx}`}
            value={item.position}
            onChange={this.handleChangePosition}
          />
        </td>
      </tr>
    ));
  }

  handleSelectCollections(e) {
    const { value, checked } = e.currentTarget;
    if (value === 'all') {
      this.setState({
        selectedCollections: checked ? this.props.collections.map((i) => i.id) : [],
      });
    } else {
      this.setState({
        selectedCollections: checked
          ? [ ...this.state.selectedCollections, value ]
          : this.state.selectedCollections.filter((i) => i !== value),
      });
    }
  }

  handleSavePosition() {
    if (this.state.changedCollections.length) {
      const updatedCollections = this.state.collections
        .filter((item) => this.state.changedCollections.includes(item.id))
        .map((item) => ({ id: item.id, position: parseInt(item.position) }))
      this.props.updateCollections(updatedCollections);
    }
  }

  handleChangePosition(e) {
    const { name, value } = e.currentTarget;
    const field = name.split('-')[0];
    const item = name.split('-')[2];
    const index = name.split('-')[3];
    const collections = _.cloneDeep(this.state.collections);
    collections[index] = { ...this.state.collections[index], [field]: value };
    this.setState({
      collections,
      changedCollections: _.uniq([ ...this.state.changedCollections, item ]),
    })
  }

  sort(e) {
    const { field } = e.currentTarget.dataset;
    const { filters } = this.state;
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
    this.props.getCollections(query);
  }

  onSelectFilter(e) {
    const { name } = e.currentTarget;
    const selected = Array.from(e.currentTarget.selectedOptions).map((o) => o.value);
    const newFilter = {
      ...this.state.filters,
      [name]: selected,
    }
    this.setState({
      filters: newFilter,
      currentPage: 1,
    });
    const query = {
      name: this.state.keyword,
      sort: 'position.asc',
      size: this.size,
      offset: 0,
    };
    Object.keys(newFilter).forEach((k) => (query[k] = newFilter[k].join()));
    this.props.getCollections(query);
  }

  onSearch(e) {
    this.setState({ keyword: e.currentTarget.value });
  }

  search(e) {
    e.preventDefault();
    this.setState({
      sortField: '',
      sortBy: '',
      currentPage: 1,
    });
    this.props.getCollections({
      name: this.state.keyword,
      sort: 'position.asc',
      size: this.size,
      offset: 0,
    });
  }

  render() {
    return (
      <Wrapper className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Breadcrumb>
              <BreadcrumbItem>
                <Link to="/">Trang chủ</Link>
              </BreadcrumbItem>
              <BreadcrumbItem active>Bộ sưu tập</BreadcrumbItem>
            </Breadcrumb>
          </Col>
        </Row>
        <Container fluid>
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify" /> Bộ sưu tập
                  <Row style={{ marginBottom: '15px' }}>
                    <Col md="4">
                      <form id="search-form" onSubmit={this.search}>
                        <InputGroup>
                          <Input onChange={this.onSearch} type="text" id="search-table" name="search-table-document" bsSize="sm" />
                          <InputGroupAddon addonType="append">
                            <Button type="submit" size="sm">Tìm kiếm</Button>
                          </InputGroupAddon>
                        </InputGroup>
                      </form>
                    </Col>
                    <Col md="8">
                      <div className="float-right" style={{ marginLeft: '10px' }}>
                        <Button
                          block
                          color="primary"
                          size="sm"
                          onClick={() =>
                            this.props.history.push('/collections/create')
                          }
                        >
                          Tạo mới
                        </Button>
                      </div>
                      <div className="float-right" style={{ marginLeft: '10px' }}>
                        <Button
                          block
                          color="warning"
                          size="sm"
                          onClick={this.handleSavePosition}
                          style={{ color: 'white' }}
                        >Sắp xếp</Button>
                      </div>
                      <div className="float-right">
                        <Button
                          block
                          color="danger"
                          size="sm"
                          onClick={() => this.props.deleteCollections((this.state.selectedCollections))}
                        >Xoá</Button>
                      </div>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Table responsive hover striped>
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th>
                          <input
                            type="checkbox"
                            value="all"
                            name="select"
                            onChange={this.handleSelectCollections}
                            checked={_.isEqual(this.state.selectedCollections, this.props.collections.map((i) => i.id))}
                          />
                        </th>
                        <th scope="col">Tên</th>
                        <th scope="col">Mô tả</th>
                        <HeadFilter
                          selectName="cateId"
                          multiple
                          scope="col"
                          options={this.props.dataInit.categories.map((i) => ({ value: i.id, label: i.name }))}
                          onSelect={this.onSelectFilter}
                          value={this.state.filters.cateId}
                        >Danh mục</HeadFilter>
                        <HeadFilter
                          selectName="subjectId"
                          multiple
                          scope="col"
                          options={this.props.dataInit.subjects.map((i) => ({ value: i.id, label: i.name }))}
                          onSelect={this.onSelectFilter}
                          value={this.state.filters.subjectId}
                        >Môn</HeadFilter>
                        <HeadFilter
                          selectName="classId"
                          multiple
                          scope="col"
                          options={this.props.dataInit.classes.map((i) => ({ value: i.id, label: i.name }))}
                          onSelect={this.onSelectFilter}
                          value={this.state.filters.classId}
                        >Lớp</HeadFilter>
                        <HeadFilter
                          selectName="yearSchools"
                          multiple
                          scope="col"
                          options={optionYear}
                          onSelect={this.onSelectFilter}
                          value={this.state.filters.yearSchools}
                        >Năm</HeadFilter>
                        <HeadSort
                          scope="col"
                          onClick={this.sort}
                          data-field="userEmail"
                          sortField={this.state.sortField}
                          sortBy={this.state.sortBy}
                        >Người tạo</HeadSort>
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
                          data-field="view"
                          sortField={this.state.sortField}
                          sortBy={this.state.sortBy}
                        >Lượt xem</HeadSort>
                        <HeadSort
                          scope="col"
                          onClick={this.sort}
                          data-field="numDocRefs"
                          sortField={this.state.sortField}
                          sortBy={this.state.sortBy}
                        >Tài liệu</HeadSort>
                        <th scope="col">Nổi bật trang chủ</th>
                        <th scope="col">Nổi bật danh mục</th>
                        <th scope="col">Vị trí</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.props.loading
                        ? (<tr><td colSpan="15" style={{ textAlign: 'center' }}>Loading...</td></tr>)
                        : this.renderCollectionRow(this.state.collections)}
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

Collection.propTypes = {
  loading: PropTypes.bool,
};

export function mapDispatchToProps(dispatch) {
  return {
    getCollections: (queries) => dispatch(getCollections(queries)),
    deleteCollections: (id) => dispatch(deleteCollections(id)),
    clearProcessStatus: (all) => dispatch(clearProcessStatus(all)),
    updateCollections: (collections) => dispatch(updateCollections(collections)),
    getDataInit: () => dispatch(getDataInit()),
  };
}

const mapStateToProps = createStructuredSelector({
  collections: makeSelectCollections(),
  total: makeSelectTotalCollection(),
  loading: makeSelectLoading(),
  processStatus: makeSelectProcessStatus(),
  dataInit: makeSelectDataInit(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'collection', reducer });
const withSaga = injectSaga({ key: 'collection', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(Collection);
