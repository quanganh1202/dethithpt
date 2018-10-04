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
  Badge,
} from 'reactstrap';
import moment from 'moment';
import styled from 'styled-components';
import Select, { Creatable } from 'react-select';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCog,
  faFolder,
  faCloudDownloadAlt,
  faCaretDown,
} from '@fortawesome/free-solid-svg-icons';
import FileSaver from 'file-saver';
import { HeadSort, PaginationTable, HeadFilter } from 'components/Table';
import PopUp from 'components/PopUp';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import {
  getDocs,
  approveDocs,
  deleteDoc,
  clearDeleteStatus,
  updateDocs,
  getDataInit,
  requestDownload,
  removeFileSave,
  getDownloadHistory,
} from './actions';
import {
  makeSelectDocuments,
  makeSelectLoading,
  makeSelectTotalUser,
  makeSelectDeleteStatus,
  makeSelectDataInit,
  makeSelectFile,
  makeSelectFileName,
  makeSelectDownloadHistory,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
import CustomSelect from './CustomSelect';

library.add(faFolder, faCog, faCloudDownloadAlt, faCaretDown);
const optionYear = Array(21)
  .fill((new Date()).getFullYear() - 20)
  .map((y, idx) => ({ value: y + idx, label: y + idx }));

const Wrapper = styled.div`
  .rct-select-input.form-control-sm {
    flex: 1 1 auto;
    background-color: white;
    border: 1px solid #e4e7ea;
    margin-right: 5px;
  }
  .custom-select + div {
    color: red;
    z-index: 1000 !important;
  }
  .card-header > .row > .col-md-2 {
    padding-left: 5px;
    padding-right: 5px;
  }
  .sticky {
    position: fixed;
    top: 0;
    width: 100%;
  }
  table {
    font-size: 11px;
    tr > td {
      white-space: nowrap;
      &:nth-child(3) {
        white-space: normal;
        min-width: 150px;
      }
      > p {
        margin: 0;
      }
      &.actions-col {
        min-width: 80px
      }
    }
    tr > th {
      white-space: nowrap;
    }
    thead > tr {
      font-size: 11px;
    }
    tbody > tr:hover {
      > td, > th {
        background-color: #CCFFCC;
      }
    }
    tr.select {
      > td, > th {
        background-color: #FFCC99;
      }
    }
  }
  span.download-file-text {
    color: blue;
    text-decoration: underline;
    cursor: pointer;
    &:hover {
      color: red;
    }
  }

  .table-renponsive {
    position: relative;
    display: block;
  }
}
`;

/* eslint-disable react/prefer-stateless-function */
export class Documents extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      currentPage: 1,
      selectedDocs: [],
      quickUpdateForm: {},
      filters: {
        cateId: [],
        subjectId: [],
        classId: [],
        yearSchools: [],
      },
      showHistory: false,
    };
    this.size = 10;
    this.maxPages = 11;
    this.sort = this.sort.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.search = this.search.bind(this);
    this.onSelectPage = this.onSelectPage.bind(this);
    this.handleSelectDoc = this.handleSelectDoc.bind(this);
    this.onQuickUpdateText = this.onQuickUpdateText.bind(this);
    this.submitQuickUpdate = this.submitQuickUpdate.bind(this);
    this.onQuickUpdateMultiSelect = this.onQuickUpdateMultiSelect.bind(this);
    this.handleMultiApprove = this.handleMultiApprove.bind(this);
    this.onSelectFilter = this.onSelectFilter.bind(this);
    this.closeDownloadHistory = this.closeDownloadHistory.bind(this);
    this.scrollTable = this.scrollTable.bind(this);
  }

  componentWillMount() {
    // get docs
    this.props.getDocs({
      sort: 'createdAt.desc',
      offset: 0,
      size: this.size,
    });
    this.props.getDataInit();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.deleteStatus && !this.props.deleteStatus) {
      this.setState({
        currentPage: 1,
        keyword: '',
        quickUpdateForm: {},
        selectedDocs: [],
      });
      this.props.getDocs({
        sort: 'createdAt.desc',
        offset: 0,
        size: this.size,
      });
      this.props.clearDeleteStatus();
    }
    if (!this.props.file && nextProps.file) {
      const blob = new Blob([nextProps.file]);
      FileSaver.saveAs(blob, _.get(nextProps, 'fileName', 'download'));
      this.props.removeFileSave();
    }
    // if (!this.props.historyDownload.length && !_.isEqual(this.props.historyDownload, nextProps.historyDownload)) {
    //   this.setState({ showHistory: true });
    // }
  }

  componentDidUpdate() {
    const thead = document.querySelector('.table-responsive > table > thead');
    const table = document.querySelector('.table-responsive');
    if (thead) {
      const rect = thead.getBoundingClientRect();

      if (rect.top >= 0) {
        table.style.maxHeight = `${window.innerHeight - rect.top}px`;
      }
    }
    window.addEventListener('scroll', this.scrollTable);
  }

  scrollTable() {
    const thead = document.querySelector('.table-responsive > table > thead');
    const table = document.querySelector('.table-responsive');
    if (thead) {
      const rect = thead.getBoundingClientRect();

      if (rect.top >= 0) {
        table.style.maxHeight = `${window.innerHeight - rect.top}px`;
      }
    }
  }

  componentWillUnmount() {
    this.props.removeFileSave();
  }

  handleDownloadFile(id, name) {
    this.props.requestDownload(id, name);
  }

  renderDocumentRow(docs) {
    return docs.map((item, idx) => (
      <tr key={item.id} className={this.state.selectedDocs.includes(item.id) ? 'select' : ''}>
        <th scope="row">{((this.state.currentPage - 1) * this.size) + idx + 1}</th>
        <td>
          <input
            type="checkbox"
            name={`select-${item.id}`}
            value={item.id}
            onClick={this.handleSelectDoc}
            checked={this.state.selectedDocs.includes(item.id)}
          />
        </td>
        <td><span className="download-file-text" onClick={() => this.handleDownloadFile(item.id, item.name)}>{item.name}</span></td>
        <td>{item.cates && item.cates.map((i) => <p key={i.cateId}>{i.cateName}</p>)}</td>
        <td>{item.subjects && item.subjects.map((i) => <p key={i.subjectId}>{i.subjectName}</p>)}</td>
        <td>{item.classes && item.classes.map((i) => <p key={i.classId}>{i.className}</p>)}</td>
        <td>{item.yearSchools && item.yearSchools.map((i) => <p key={i}>{i}</p>)}</td>
        <td>{item.price}</td>
        <td>{item.totalPages}</td>
        <td>{item.view}</td>
        <td>{item.comment}</td>
        <td>{moment(item.createdAt).format('DD/MM/YYYY')}</td>
        <td>{item.userEmail}</td>
        <td>{item.approved === 1
            ? <Badge style={{ fontSize: '11px' }} color="success">Đã duyệt</Badge>
            : <Badge style={{ fontSize: '11px' }} color="warning">Chưa duyệt</Badge>}</td>
        <td>{item.description}</td>
        <td className="actions-col">
          <div>
            <button
              style={{ float: 'left', padding: '0', marginRight: '5px' }}
              onClick={() => this.props.deleteDoc([item.id])}
              title="Xóa"
            >
              <i className="fa fa-trash-o fa-lg" aria-hidden="true" style={{ color: "#555" }}></i>
            </button>
            <button
              style={{ float: 'left', padding: '0', marginRight: '5px' }}
              onClick={() => this.props.history.push(`/documents/${item.id}`)}
              title="Sửa"
            >
              <i className="fa fa-pencil-square-o fa-lg" aria-hidden="true"></i>
            </button>
            <button
              style={{ float: 'left', padding: '0' }}
              onClick={() => this.props.history.push(`/documents/${item.id}?update=note`)}
              title="Ghi chú"
            >
              <i className="fa fa-sticky-note fa-lg" aria-hidden="true"></i>
            </button>
          </div>
          <div>
            <button
              style={{ float: 'left', padding: '0', marginRight: '5px' }}
              onClick={() => this.props.approve([item.id])}
              title="Xuất bản"
            >
              <i className="fa fa-newspaper-o fa-lg" aria-hidden="true"></i>
            </button>
            <button
              style={{ float: 'left', padding: '0', marginRight: '5px' }}
              onClick={() => this.props.updateDocs([item.id], { priority: 1 })}
              title="Nổi bật"
            >
              <i className="fa fa-star fa-lg" aria-hidden="true"></i>
            </button>
            <button
              style={{ float: 'left', padding: '0' }}
              onClick={() => {
                this.props.getDownloadHistory(item.id);
                this.setState({ showHistory: item.name });
              }}
              title="Lịch sử tải"
            >
              <i className="fa fa-history fa-lg" aria-hidden="true"></i>
            </button>
          </div>
        </td>
        <td></td>
        <td>{item.id}</td>
      </tr>
    ))
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
    this.props.getDocs(query);
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
      sort: 'createdAt.desc',
      size: this.size,
      offset: 0,
      filters: {
        cateId: [],
      }
    });
  }

  onSelectPage(page) {
    if (this.state.currentPage !== page) {
      const { sortField, sortBy, filters } = this.state;
      this.setState({
        currentPage: page,
        selectedDocs: [],
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
      this.props.getDocs(query)
    }
  }

  handleSelectDoc(e) {
    const { name, value, checked } = e.currentTarget;
    if (value === 'all') {
      this.setState({
        selectedDocs: checked ? this.props.documents.map((i) => i.id) : [],
      });
    } else {
      this.setState({
        selectedDocs: checked
          ? [ ...this.state.selectedDocs, value ]
          : this.state.selectedDocs.filter((i) => i !== value),
      });
    }
  }

  onQuickUpdateText(e) {
    const { name, value } = e.currentTarget;
    this.setState({
      quickUpdateForm: {
        ...this.state.quickUpdateForm,
        [name]: value,
      },
    })
  }

  onQuickUpdateMultiSelect(name, value) {
    this.setState({
      quickUpdateForm: {
        ...this.state.quickUpdateForm,
        [name]: value,
      },
    })
  }

  submitQuickUpdate(field) {
    if (this.state.selectedDocs.length) {
      if (field === 'price') {
        this.props.updateDocs(this.state.selectedDocs, { [field]: this.state.quickUpdateForm[field] });
      } else {
        const dataUpdate = this.state.quickUpdateForm[field].map((i) => i.value).join();
        this.props.updateDocs(this.state.selectedDocs, { [field]: dataUpdate });
      }
    }
  }

  handleMultiApprove() {
    const valid = this.state.selectedDocs.filter((i) => {
      return this.props.documents.find((d) => d.id === i).approved === 0;
    });
    this.props.approve(valid);
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
      sort: 'createdAt.desc',
      size: this.size,
      offset: 0,
    };
    Object.keys(newFilter).forEach((k) => (query[k] = newFilter[k].join()));
    this.props.getDocs(query);
  }

  closeDownloadHistory() {
    this.setState({ showHistory: false });
    this.props.removeFileSave();
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
                  <Row style={{ marginBottom: '15px' }}>
                    <Col md="4">
                      <InputGroup>
                        <Input onChange={this.onSearch} type="text" id="search-table" name="search-table-document" bsSize="sm" />
                        <InputGroupAddon addonType="append">
                          <Button type="button" onClick={this.search} size="sm">Tìm kiếm</Button>
                        </InputGroupAddon>
                      </InputGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="3">
                      <span className="bold">Thao tác nhanh:</span>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="2">
                      <InputGroup>
                        <Input
                          style={{ marginRight: '5px'}}
                          onChange={this.onQuickUpdateText}
                          type="number"
                          name="price"
                          bsSize="sm"
                          placeholder="Giá..."
                          value={this.state.quickUpdateForm.price || ''}
                        />
                        <InputGroupAddon addonType="append">
                          <Button type="button" onClick={() => this.submitQuickUpdate('price')} size="sm">Sửa giá</Button>
                        </InputGroupAddon>
                      </InputGroup>
                    </Col>
                    <Col md="2">
                      <InputGroup>
                        <Select
                          name="cateIds"
                          className="rct-select-input form-control-sm"
                          options={this.props.dataInit.categories.map(sj => ({ value: sj.id, label: sj.name }))}
                          value={this.state.quickUpdateForm.cateIds || []}
                          onChange={(value) => this.onQuickUpdateMultiSelect('cateIds', value)}
                          isMulti
                          hideSelectedOptions={false}
                          closeMenuOnSelect={false}
                          placeholder="Chọn danh mục"
                          isSearchable={false}
                          components={{
                            DropdownIndicator: () => (
                              <FontAwesomeIcon
                                style={{ margin: '0 0 0 5px' }}
                                className="title-icon"
                                icon={['fas', 'caret-down']}
                              />
                            ),
                            Control: CustomSelect,
                            MultiValueContainer: (props) => null,
                            IndicatorSeparator: (props) => null,
                          }}
                          styles={{
                            clearIndicator: () => ({
                              color: 'black',
                            }),
                            placeholder: (base) => ({ ...base, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' })
                          }}
                        />
                        <InputGroupAddon addonType="append">
                          <Button type="button" onClick={() => this.submitQuickUpdate('cateIds')} size="sm">Chuyển</Button>
                        </InputGroupAddon>
                      </InputGroup>
                    </Col>
                    <Col md="2">
                      <InputGroup>
                        <Select
                          name="subjectIds"
                          className="rct-select-input form-control-sm"
                          options={this.props.dataInit.subjects.map(sj => ({ value: sj.id, label: sj.name }))}
                          value={this.state.quickUpdateForm.subjectIds || []}
                          onChange={(value) => this.onQuickUpdateMultiSelect('subjectIds', value)}
                          isMulti
                          hideSelectedOptions={false}
                          closeMenuOnSelect={false}
                          placeholder="Chọn môn"
                          isSearchable={false}
                          components={{
                            DropdownIndicator: () => (
                              <FontAwesomeIcon
                                style={{ margin: '0 0 0 5px' }}
                                className="title-icon"
                                icon={['fas', 'caret-down']}
                              />
                            ),
                            Control: CustomSelect,
                            MultiValueContainer: (props) => null,
                            IndicatorSeparator: (props) => null,
                          }}
                          styles={{
                            clearIndicator: () => ({
                              color: 'black',
                            }),
                            placeholder: (base) => ({ ...base, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' })
                          }}
                        />
                        <InputGroupAddon addonType="append">
                          <Button type="button" onClick={() => this.submitQuickUpdate('subjectIds')} size="sm">Chuyển</Button>
                        </InputGroupAddon>
                      </InputGroup>
                    </Col>
                    <Col md="2">
                      <InputGroup>
                        <Select
                          name="classIds"
                          className="rct-select-input form-control-sm"
                          options={this.props.dataInit.classes.map(sj => ({ value: sj.id, label: sj.name }))}
                          value={this.state.quickUpdateForm.classIds || []}
                          onChange={(value) => this.onQuickUpdateMultiSelect('classIds', value)}
                          isMulti
                          hideSelectedOptions={false}
                          closeMenuOnSelect={false}
                          placeholder="Chọn lớp"
                          isSearchable={false}
                          components={{
                            DropdownIndicator: () => (
                              <FontAwesomeIcon
                                style={{ margin: '0 0 0 5px' }}
                                className="title-icon"
                                icon={['fas', 'caret-down']}
                              />
                            ),
                            Control: CustomSelect,
                            MultiValueContainer: (props) => null,
                            IndicatorSeparator: (props) => null,
                          }}
                          styles={{
                            clearIndicator: () => ({
                              color: 'black',
                            }),
                            placeholder: (base) => ({ ...base, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' })
                          }}
                        />
                        <InputGroupAddon addonType="append">
                          <Button type="button" onClick={() => this.submitQuickUpdate('classIds')} size="sm">Chuyển</Button>
                        </InputGroupAddon>
                      </InputGroup>
                    </Col>
                    <Col md="2">
                      <InputGroup>
                        <Select
                          name="yearSchools"
                          className="rct-select-input form-control-sm"
                          options={optionYear}
                          value={this.state.quickUpdateForm.yearSchools || []}
                          onChange={(value) => this.onQuickUpdateMultiSelect('yearSchools', value)}
                          isMulti
                          hideSelectedOptions={false}
                          closeMenuOnSelect={false}
                          placeholder="Chọn năm học"
                          isSearchable={false}
                          components={{
                            DropdownIndicator: () => (
                              <FontAwesomeIcon
                                style={{ margin: '0 0 0 5px' }}
                                className="title-icon"
                                icon={['fas', 'caret-down']}
                              />
                            ),
                            Control: CustomSelect,
                            MultiValueContainer: (props) => null,
                            IndicatorSeparator: (props) => null,
                          }}
                          styles={{
                            clearIndicator: () => ({
                              color: 'black',
                            }),
                            placeholder: (base) => ({ ...base, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' })
                          }}
                        />
                        <InputGroupAddon addonType="append">
                          <Button type="button" onClick={() => this.submitQuickUpdate('yearSchools')} size="sm">Chuyển</Button>
                        </InputGroupAddon>
                      </InputGroup>
                    </Col>
                    <Col md="2">
                      <InputGroup>
                        <Select
                          name="collectionIds"
                          className="rct-select-input form-control-sm"
                          options={this.props.dataInit.collections.map(sj => ({ value: sj.id, label: sj.name }))}
                          value={this.state.quickUpdateForm.collectionIds || []}
                          onChange={(value) => this.onQuickUpdateMultiSelect('collectionIds', value)}
                          isMulti
                          hideSelectedOptions={false}
                          closeMenuOnSelect={false}
                          placeholder="Chọn bộ sưu tập"
                          isSearchable={false}
                          components={{
                            DropdownIndicator: () => (
                              <FontAwesomeIcon
                                style={{ margin: '0 0 0 5px' }}
                                className="title-icon"
                                icon={['fas', 'caret-down']}
                              />
                            ),
                            Control: CustomSelect,
                            MultiValueContainer: (props) => null,
                            IndicatorSeparator: (props) => null,
                          }}
                          styles={{
                            clearIndicator: () => ({
                              color: 'black',
                            }),
                            placeholder: (base) => ({ ...base, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' })
                          }}
                        />
                        <InputGroupAddon addonType="append">
                          <Button type="button" onClick={() => this.submitQuickUpdate('collectionIds')} size="sm">Chuyển</Button>
                        </InputGroupAddon>
                      </InputGroup>
                    </Col>
                  </Row>
                  <Row style={{ marginTop: '15px' }}>
                    <Col md="4">
                      <Button
                        type="button"
                        onClick={this.handleMultiApprove}
                        size="sm"
                        style={{ marginRight: '5px' }}
                      >Duyệt nhanh</Button>
                      <Button
                        type="button"
                        onClick={() => this.props.deleteDoc((this.state.selectedDocs))}
                        size="sm"
                      >Xóa nhanh</Button>
                    </Col>
                  </Row>
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
                  <Table responsive hover striped>
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th>
                          <input
                            type="checkbox"
                            value="all"
                            name="select"
                            onChange={this.handleSelectDoc}
                            checked={_.isEqual(this.state.selectedDocs, this.props.documents.map((i) => i.id))}
                          />
                        </th>
                        <HeadSort
                          scope="col"
                          onClick={this.sort}
                          data-field="name"
                          sortField={this.state.sortField}
                          sortBy={this.state.sortBy}
                        >Tài liệu</HeadSort>
                        <HeadFilter
                          selectName="cateId"
                          multiple
                          scope="col"
                          options={this.props.dataInit.categories.map((i) => ({ value: i.id, label: i.name }))}
                          onSelect={this.onSelectFilter}
                          value={this.state.filters.cateId}
                        >
                          Danh mục
                        </HeadFilter>
                        <HeadFilter
                          selectName="subjectId"
                          multiple
                          scope="col"
                          options={this.props.dataInit.subjects.map((i) => ({ value: i.id, label: i.name }))}
                          onSelect={this.onSelectFilter}
                          value={this.state.filters.subjectId}
                        >
                          Môn học
                        </HeadFilter>
                        <HeadFilter
                          selectName="classId"
                          multiple
                          scope="col"
                          options={this.props.dataInit.classes.map((i) => ({ value: i.id, label: i.name }))}
                          onSelect={this.onSelectFilter}
                          value={this.state.filters.classId}
                        >
                          Lớp
                        </HeadFilter>
                        <HeadFilter
                          selectName="yearSchools"
                          multiple
                          scope="col"
                          options={optionYear}
                          onSelect={this.onSelectFilter}
                          value={this.state.filters.yearSchools || ''}
                        >
                          Năm học
                        </HeadFilter>
                        <HeadSort
                          scope="col"
                          onClick={this.sort}
                          data-field="price"
                          sortField={this.state.sortField}
                          sortBy={this.state.sortBy}
                        >Giá</HeadSort>
                        <th scope="col">Trang</th>
                        <th scope="col">Lượt tải</th>
                        <th scope="col">Bình luận</th>
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
                          data-field="userName"
                          sortField={this.state.sortField}
                          sortBy={this.state.sortBy}
                        >Người tạo</HeadSort>
                        <th scope="col">Trạng thái</th>
                        <th scope="col">Ghi chú</th>
                        <th scope="col">Thao tác</th>
                        <th scope="col">Vị trí</th>
                        <th scope="col">Mã</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(this.props.documents.length)
                        ? this.renderDocumentRow(this.props.documents)
                        : (<tr style={{ textAlign: 'center' }}>
                            <td colSpan="18">Không tìm thấy bản ghi nào!</td>
                          </tr>)}
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
          <PopUp
            show={!!this.state.showHistory}
            onClose={this.closeDownloadHistory}
            content={
              <Card style={{ maxHeight: 'calc(100vh - 200px)'}}>
                <CardHeader>
                  <p className="float-left"
                    style={{
                      wordBreak: 'break-all',
                      maxWidth: '90%',
                    }}
                  >
                    <i className="fa fa-history"></i> Lịch sử tải <span style={{ color: 'blue' }}>"{this.state.showHistory}"</span>
                  </p>
                  <span
                    className="float-right btn-close-popup"
                    title="Đóng cửa sổ"
                    style={{
                      fontSize: '15px',
                      cursor: 'pointer'
                    }}
                    onClick={this.closeDownloadHistory}
                  ><i className="fa fa-close"></i></span>
                </CardHeader>
                <CardBody style={{ overflow: 'auto' }}>
                  <Table responsive hover striped>
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Người tải</th>
                        <th scope="col">Thời gian tải</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.props.historyDownload.length ? this.props.historyDownload.map((i, idx) => (
                        <tr key={i.id}>
                          <td>{idx + 1}</td>
                          <td>{i.userEmail}</td>
                          <td>{moment(i.createdAt).format('DD/MM/YYYY hh:mm:ss')}</td>
                        </tr>
                      )) : (
                        this.props.loading
                          ? <tr><td colSpan="3">loading</td></tr>
                          : <tr><td colSpan="3">Không tìm thấy lượt tải nào</td></tr>
                      )}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            }
          />
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
    deleteDoc: (id) => dispatch(deleteDoc(id)),
    updateDocs: (ids, data) => dispatch(updateDocs(ids, data)),
    clearDeleteStatus: () => dispatch(clearDeleteStatus()),
    getDataInit: () => dispatch(getDataInit()),
    requestDownload: (id, name) => dispatch(requestDownload(id, name)),
    removeFileSave: () => dispatch(removeFileSave()),
    getDownloadHistory: (id) => dispatch(getDownloadHistory(id)),
  };
}

const mapStateToProps = createStructuredSelector({
  documents: makeSelectDocuments(),
  total: makeSelectTotalUser(),
  loading: makeSelectLoading(),
  deleteStatus: makeSelectDeleteStatus(),
  dataInit: makeSelectDataInit(),
  file: makeSelectFile(),
  fileName: makeSelectFileName(),
  historyDownload: makeSelectDownloadHistory(),
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
