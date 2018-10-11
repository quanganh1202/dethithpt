/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import axios from 'axios';
import { createStructuredSelector } from 'reselect';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
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
  Label,
  FormGroup,
  FormText,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from 'reactstrap';
import classnames from 'classnames';
import moment from 'moment';
import styled from 'styled-components';
import { HeadSort, PaginationTable, HeadFilter } from 'components/Table';
import PopUp from 'components/PopUp';
import LoadingIndicator from 'components/LoadingIndicator';

import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { getToken } from 'services/auth';
import { getUsers, getDataInit, getHistory, clearData } from './actions';
import { moneyValidation, numberWithCommas } from 'services/helper';
import {
  makeSelectUsers,
  makeSelectLoading,
  makeSelectTotalUser,
  makeSelectDataInit,
  makeSelectHistory,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
import local from './newLocal.json';

const Wrapper = styled.div`
  table {
    font-size: 11px;
  }
  table.user-list-table {
    tr > td,
    tr > th {
      white-space: nowrap;
    }
  }

  .rdw-editor-main {
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 2px;
    padding: 0 10px;
  }

  .rdw-editor-toolbar {
    border: 1px solid #ccc;
  }

  .actions-col {
    min-width: 80px;
  }
`;

const NewLoadingIndicator = styled.div`
  display: ${props => (props.active ? 'unset' : 'none')};
  position: absolute;
  right: -30px;
  top: 3px;
  & div {
    width: 20px !important;
    height: 20px;
    margin: 0;
  }
`;

function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(String(email).toLowerCase());
}

const mappingRolePosition = {
  admin: 'Admin',
  student: 'Học sinh',
  teacher: 'Giáo viên',
  other: 'Khác',
};
/* eslint-disable react/prefer-stateless-function */
export class User extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      currentPage: 1,
      editorState: EditorState.createEmpty(),
      selectedUsers: [],
      filters: {
        level: [],
      },
      quickDate: '',
      activeTab: '1',
      showHistory: false,
    };
    this.size = 10;
    this.maxPages = 11;
    this.sort = this.sort.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.search = this.search.bind(this);
    this.onSelectPage = this.onSelectPage.bind(this);
    this.handleChangeFile = this.handleChangeFile.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.onEditorStateChange = this.onEditorStateChange.bind(this);
    this.quickSubmit = this.quickSubmit.bind(this);
    this.handleSelectUsers = this.handleSelectUsers.bind(this);
    this.onSelectFilter = this.onSelectFilter.bind(this);
    this.scrollTable = this.scrollTable.bind(this);
    this.toggle = this.toggle.bind(this);
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

  componentWillUnmount() {
    this.props.clearData(true);
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

  onEditorStateChange(editorState) {
    this.setState({
      editorState,
      quickContent: draftToHtml(
        convertToRaw(this.state.editorState.getCurrentContent()),
      ),
    });
  }

  handleSelectUsers(e) {
    const { value, checked } = e.currentTarget;
    if (value === 'all') {
      this.setState({
        selectedUsers: checked ? this.props.users.map(i => i.id) : [],
      });
    } else {
      this.setState({
        selectedUsers: checked
          ? [...this.state.selectedUsers, value]
          : this.state.selectedUsers.filter(i => i !== value),
      });
    }
  }

  renderUserRow(users, purchase) {
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
        <td><Link to={`/users/${item.id}`}>{item.name}</Link></td>
        <td>{item.email}</td>
        <td>{mappingRolePosition[item.role === 'admin' ? 'admin' : item.position]}</td>
        <td>{item.phone}</td>
        <td>{item.bod}</td>
        <td>{item.level}</td>
        <td>{item.school}</td>
        <td>{item.city}</td>
        <td>{item.numOfDownloaded || 0}</td>
        <td>{item.numOfUploaded || 0}</td>
        <td>{numberWithCommas(moneyValidation(purchase[item.id]))} đ</td>
        <td>{numberWithCommas(moneyValidation(item.money))} đ</td>
        <td>{item.group}</td>
        <td>{item.note1}</td>
        <td>{item.note2}</td>
        <td>
          {item.status === 1 ? (
            <Badge style={{ fontSize: '11px' }} color="success">
              Active
            </Badge>
          ) : (
            <Badge style={{ fontSize: '11px' }} color="warning">
              Pending
            </Badge>
          )}
        </td>
        {/* <td>{item.userName}</td> */}
        <td className="actions-col">
          <div>
            <button
              style={{ float: 'left', padding: '0', marginRight: '5px' }}
              onClick={() => this.props.deleteUser([item.id])}
              title="Xóa"
            >
              <i className="fa fa-trash-o fa-lg" aria-hidden="true" style={{ color: "#555" }}></i>
            </button>
            <button
              style={{ float: 'left', padding: '0', marginRight: '5px' }}
              onClick={() => this.props.history.push(`/users/${item.id}`)}
              title="Sửa"
            >
              <i className="fa fa-pencil-square-o fa-lg" aria-hidden="true"></i>
            </button>
            <button
              style={{ float: 'left', padding: '0' }}
              onClick={() => {}}
              title="Block/Unblock thành viên"
            >
              <i className="fa fa-lock fa-lg" aria-hidden="true"></i>
            </button>
          </div>
          <div>
            <button
              style={{ float: 'left', padding: '0', marginRight: '5px' }}
              onClick={() => this.props.history.push(`/users/${item.id}?update=note1`)}
              title="Ghi chú"
            >
              <i className="fa fa-sticky-note fa-lg" aria-hidden="true"></i>
            </button>
            <button
              style={{ float: 'left', padding: '0', marginRight: '5px' }}
              onClick={() => this.props.history.push(`/users/${item.id}?update=note2`)}
              title="Ghi chú 2"
            >
              <i className="fa fa-sticky-note fa-lg" aria-hidden="true"></i>
            </button>
            <button
              style={{ float: 'left', padding: '0' }}
              onClick={() => {
                this.setState({ showHistory: item.id });
                this.props.getHistory(item.id, this.state.activeTab);
              }}
              title="Lịch sử hoạt động thành viên"
            >
              <i className="fa fa-history fa-lg" aria-hidden="true"></i>
            </button>
          </div>
        </td>
        <td>{moment(item.updatedAt).format('hh:mm - DD/MM/YYYY')}</td>
      </tr>
    ));
  }

  sort(e) {
    const { field } = e.currentTarget.dataset;
    const sortField = field;
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
    Object.keys(this.state.filters).forEach(k => {
      query[k] = this.state.filters[k].join();
    });
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
      Object.keys(filters).forEach(k => {
        query[k] = filters[k].join();
      });
      this.props.getUsers(query);
    }
  }

  handleChangeFile(e) {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      const content = fileReader.result;
      const validatedEmail = content
        .split('\n')
        .filter(email => validateEmail(email));
      this.setState({
        quickActive: true,
        quickList: validatedEmail,
        successCount: false,
      });
    };
    fileReader.readAsText(file);
  }

  handleOnChange(e) {
    this.setState({
      quickActive: e.target.value,
    });
  }

  quickSubmit() {
    const {
      quickActive,
      quickContent,
      quickList,
      quickMoney,
      quickBlock,
      quickDate,
    } = this.state;
    if (quickActive && quickList) {
      const options = {
        headers: {
          'x-access-token': getToken(),
        },
      };
      const content = {};
      let url = '';
      let method = axios.put;
      switch (quickActive) {
        case '3':
          content.status = quickBlock ? 3 : 1;
          if (quickDate) {
            content.blockFrom = moment(quickDate).format('YYYY/MM/DD');
          }
          // if (quickMoney) {
          //   content.blockMoney = quickMoney;
          // }
          url = '/block';

          break;
        case '1':
          content.money = 0;
          break;
        case '2':
          content.money = parseInt(quickMoney, 0);
          url = '/bonus';
          method = axios.post;
          break;
        case '4':
          content.notifyStatus = '1';
          content.notifyText = quickContent;
          break;
        case '5':
          content.note1 = quickContent;
          break;
        default:
          break;
      }

      axios.get('/api/users?fields=id,email').then(response => {
        const listUsers = {};
        response.data.data.map((d, i) => {
          listUsers[d.email] = d.id;
          return i;
        });

        const requests = [];
        quickList.forEach(email => {
          if (listUsers[email.trim()]) {
            requests.push(
              method(
                `/api/users${url}/${listUsers[email.trim()]}`,
                content,
                options,
              ).catch(() => {}),
            );
          }
        });
        axios.all(requests).then(res => {
          const result = res.filter(r => r && r.data.statusCode === 200);
          document.getElementById('exampleFile').value = '';
          this.setState({
            quickActive: false,
            quickList: [],
            successCount: result ? result.length : 0,
            inProgress: false,
          });
        });
      });

      this.setState({
        inProgress: true,
      });
    }
  }

  onSelectFilter(e) {
    const { name } = e.currentTarget;
    const selected = Array.from(e.currentTarget.selectedOptions).map(
      o => o.value,
    );
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
    Object.keys(newFilter).forEach(k => {
      query[k] = newFilter[k].join();
    });
    this.props.getUsers(query);
  }

  toggle(tabId) {
    this.setState({ activeTab: tabId });
    this.props.getHistory(this.state.showHistory, tabId);
  }

  renderTabContent(tabId, data, loading) {
    switch (tabId) {
      case '1':
        return (
          <TabPane tabId={tabId}>
            {loading ? null : (
              <Table responsive hover striped>
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Mã tài liệu</th>
                    <th scope="col">Tài liệu</th>
                    <th scope="col">Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {data.count() ? data.map((i, idx) => (
                    <tr key={i.get('id')}>
                      <td>{idx + 1}</td>
                      <td><Link to={`/documents/${i.get('id')}`}>{i.get('docId')}</Link></td>
                      <td><Link to={`/documents/${i.get('id')}`}>{i.get('docName')}</Link></td>
                      <td>{moment(i.get('createdAt')).format('DD/MM/YYYY hh:mm:ss')}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan="4" style={{ textAlign: 'center' }}>Không tìm thấy lượt tải nào</td></tr>
                  )}
                </tbody>
              </Table>
            )}
          </TabPane>
        );
      case '2': 
        return (
          <TabPane tabId={tabId}>
            {loading ? null : (
              <Table responsive hover striped>
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Mã tài liệu</th>
                    <th scope="col">Tài liệu</th>
                    <th scope="col">Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {data.count() ? data.map((i, idx) => (
                    <tr key={i.get('id')}>
                      <td>{idx + 1}</td>
                      <td><Link to={`/documents/${i.get('id')}`}>{i.get('id')}</Link></td>
                      <td><Link to={`/documents/${i.get('id')}`}>{i.get('name')}</Link></td>
                      <td>{moment(i.get('createdAt')).format('DD/MM/YYYY hh:mm:ss')}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan="4" style={{ textAlign: 'center' }}>Không tìm thấy bài đăng nào</td></tr>
                  )}
                </tbody>
              </Table>
            )}
          </TabPane>
        );
      case '3':
        return (
          <TabPane tabId={tabId}>
            {loading ? null : (
              <Table responsive hover striped>
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Số tiền nạp</th>
                    <th scope="col">Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {data.count() ? data.map((i, idx) => (
                    <tr key={i.get('id')}>
                      <td>{idx + 1}</td>
                      <td>{numberWithCommas(i.get('money'))}đ</td>
                      <td>{moment(i.get('createdAt')).format('DD/MM/YYYY hh:mm:ss')}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan="4" style={{ textAlign: 'center' }}>Không tìm thấy giao dịch nào</td></tr>
                  )}
                </tbody>
              </Table>
            )}
          </TabPane>
        );
      case '4':
        return (
          <TabPane tabId={tabId}>
            {loading ? null : (
              <Table responsive hover striped>
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Số tiền nạp</th>
                    <th scope="col">Admin nạp</th>
                    <th scope="col">Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {data.count() ? data.map((i, idx) => (
                    <tr key={i.get('id')}>
                      <td>{idx + 1}</td>
                      <td>{numberWithCommas(i.get('money'))}đ</td>
                      <td>{i.get('actorMail')}</td>
                      <td>{moment(i.get('createdAt')).format('DD/MM/YYYY hh:mm:ss')}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan="4" style={{ textAlign: 'center' }}>Không tìm thấy giao dịch nào</td></tr>
                  )}
                </tbody>
              </Table>
            )}
          </TabPane>
        );
      case '5':
        return (
          <TabPane tabId={tabId}>
            {loading ? null : (
              <Table responsive hover striped>
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Mã tài liệu</th>
                    <th scope="col">Tài liệu</th>
                    <th scope="col">Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {data.count() ? data.map((i, idx) => (
                    <tr key={i.get('id')}>
                      <td>{idx + 1}</td>
                      <td><Link to={`/documents/${i.get('id')}`}>{i.get('docId')}</Link></td>
                      <td><Link to={`/documents/${i.get('id')}`}>{i.get('docName')}</Link></td>
                      <td>{moment(i.get('createdAt')).format('DD/MM/YYYY hh:mm:ss')}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan="4" style={{ textAlign: 'center' }}>Không tìm thấy bình luận nào</td></tr>
                  )}
                </tbody>
              </Table>
            )}
          </TabPane>
        );
      default:
        return null;
    }
  }

  render() {
    return (
      <Wrapper className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Breadcrumb>
              <BreadcrumbItem>
                <Link href="/" to="/">
                  Trang chủ
                </Link>
              </BreadcrumbItem>
              <BreadcrumbItem active>Thành viên</BreadcrumbItem>
            </Breadcrumb>
          </Col>
        </Row>
        <Container fluid>
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader>
                  <Row style={{ marginBottom: '15px' }}>
                    <Col md="3">
                      <InputGroup>
                        <Input
                          onChange={this.onSearch}
                          type="text"
                          id="search-table"
                          name="search-table-user"
                          bsSize="sm"
                        />
                        <InputGroupAddon addonType="append">
                          <Button type="button" onClick={this.search} size="sm">
                            Tìm kiếm
                          </Button>
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
                    <Label sm={2}>File:</Label>
                    <Col sm={10}>
                      <Input
                        type="file"
                        name="file"
                        id="exampleFile"
                        onChange={this.handleChangeFile}
                      />
                      <FormText color="muted">
                        Tải lên danh sách các email cần cập nhật.
                      </FormText>
                      {this.state.successCount ? (
                        <div style={{ color: 'green' }}>
                          Đã thực hiện cho{' '}
                          <b style={{ color: 'red' }}>
                            {this.state.successCount}
                          </b>{' '}
                          thành viên
                        </div>
                      ) : null}
                    </Col>
                  </Row>
                  {this.state.quickActive ? (
                    <div>
                      <Row>
                        <Label md={2}>Lựa chọn:</Label>
                        <Col md="10" style={{ marginBottom: '10px' }}>
                          {[
                            {
                              text: 'Trừ hết tiền',
                              value: 1,
                            },
                            {
                              text: 'Cộng tiền',
                              value: 2,
                            },
                            {
                              text: 'Khóa sử dụng tiền',
                              value: 3,
                            },
                            {
                              text: 'Thông báo',
                              value: 4,
                            },
                            {
                              text: 'Ghi chú 1',
                              value: 5,
                            },
                          ].map(opt => (
                            <FormGroup check key={opt.value}>
                              <Label check>
                                <Input
                                  type="radio"
                                  name="radio1"
                                  value={opt.value}
                                  onChange={this.handleOnChange}
                                />{' '}
                                {opt.text}
                              </Label>
                            </FormGroup>
                          ))}
                        </Col>
                      </Row>
                      <Row>
                        <Label sm={2}> </Label>
                        <Col sm={10}>
                          {(() => {
                            switch (this.state.quickActive) {
                              case '2':
                                return (
                                  <input
                                    type="number"
                                    className="rdw-editor-main"
                                    onChange={e =>
                                      this.setState({
                                        quickMoney: e.target.value,
                                      })
                                    }
                                  />
                                );
                              case '4':
                              case '5':
                                return (
                                  <Editor
                                    editorState={this.state.editorState}
                                    name="description"
                                    onEditorStateChange={
                                      this.onEditorStateChange
                                    }
                                  />
                                );
                              case '3':
                                return (
                                  <div>
                                    <div>
                                      <DatePicker
                                        className="rdw-editor-main"
                                        selected={this.state.quickDate}
                                        onChange={date =>
                                          this.setState({ quickDate: date })
                                        }
                                        dateFormat="DD/MM/YYYY"
                                      />
                                      <Label
                                        check
                                        style={{
                                          margin: '10px',
                                          marginLeft: '20px',
                                        }}
                                      >
                                        <Input
                                          type="checkbox"
                                          onChange={e =>
                                            this.setState({
                                              quickBlock: e.target.checked,
                                            })
                                          }
                                        />{' '}
                                        Khóa / Mở khóa
                                      </Label>
                                      
                                      <FormText color="muted">
                                        Chọn ngày tài khoản sẽ bị khóa ( Xóa
                                        trắng để Khóa ngay tài khoản )
                                      </FormText>
                                    </div>
                                    <Editor
                                      editorState={this.state.editorState}
                                      name="description"
                                      onEditorStateChange={
                                        this.onEditorStateChange
                                      }
                                    />
                                  </div>
                                );
                              default:
                                return null;
                            }
                          })()}
                        </Col>
                      </Row>
                      <Row>
                        <Label sm={2}> </Label>
                        <Col sm={2}>
                          <Button
                            block
                            color="success"
                            size="sm"
                            onClick={
                              this.state.inProgress
                                ? () => {}
                                : this.quickSubmit
                            }
                            style={{ marginTop: '10px', position: 'relative' }}
                          >
                            Thực hiện
                            <NewLoadingIndicator active={this.state.inProgress}>
                              <LoadingIndicator />
                            </NewLoadingIndicator>
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  ) : null}
                </CardHeader>
                <CardBody>
                  <Table responsive hover striped className="user-list-table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">
                          <input
                            type="checkbox"
                            value="all"
                            name="select"
                            onChange={this.handleSelectUsers}
                            checked={isEqual(
                              this.state.selectedUsers,
                              this.props.users.map(i => i.id),
                            )}
                          />
                        </th>
                        <HeadSort
                          scope="col"
                          onClick={this.sort}
                          data-field="createdAt"
                          sortField={this.state.sortField}
                          sortBy={this.state.sortBy}
                        >
                          Ngày tạo
                        </HeadSort>
                        <HeadSort
                          scope="col"
                          onClick={this.sort}
                          data-field="name"
                          sortField={this.state.sortField}
                          sortBy={this.state.sortBy}
                        >
                          Tên
                        </HeadSort>
                        <HeadSort
                          scope="col"
                          onClick={this.sort}
                          data-field="email"
                          sortField={this.state.sortField}
                          sortBy={this.state.sortBy}
                        >
                          Email
                        </HeadSort>
                        <HeadFilter
                          selectName="role"
                          multiple
                          scope="col"
                          options={[
                            { value: 'admin', label: 'admin' },
                            { value: 'student', label: 'student' },
                          ]}
                          onSelect={this.onSelectFilter}
                          value={this.state.filters.role || []}
                        >
                          Bạn là
                        </HeadFilter>
                        <th scope="col">SĐT</th>
                        <HeadFilter
                          selectName="bod"
                          multiple
                          scope="col"
                          options={Array(81)
                            .fill(new Date().getFullYear() - 80)
                            .map((y, idx) => ({
                              value: y + idx,
                              label: y + idx,
                            }))}
                          onSelect={this.onSelectFilter}
                          value={this.state.filters.bod || []}
                        >
                          Năm sinh
                        </HeadFilter>
                        <HeadFilter
                          selectName="level"
                          multiple
                          scope="col"
                          options={this.props.dataInit.classes.map(v => ({
                            value: v.id,
                            label: v.name,
                          }))}
                          onSelect={this.onSelectFilter}
                          value={this.state.filters.level || []}
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
                          value={this.state.filters.school || []}
                        >
                          Trường
                        </HeadFilter>
                        <HeadFilter
                          selectName="city"
                          multiple
                          scope="col"
                          options={local.map(city => ({
                            label: city.name,
                            value: city.code,
                          }))}
                          onSelect={this.onSelectFilter}
                          value={this.state.filters.city || []}
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
                          value={this.state.filters.group || []}
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
                          value={this.state.filters.description2 || []}
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
                          value={this.state.filters.status || []}
                        >
                          Trạng thái
                        </HeadFilter>
                        {/* <th scope="col">Người tạo</th> */}
                        <th scope="col">Thao tác&nbsp;&nbsp;&nbsp;</th>
                        <th scope="col">Hoạt động gần đây</th>
                      </tr>
                    </thead>
                    <tbody>{this.renderUserRow(this.props.users, this.props.dataInit.purchaseHistory)}</tbody>
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
          {this.state.showHistory && (
            <PopUp
              show={!!this.state.showHistory}
              onClose={() => {
                this.props.clearData();
                this.setState({ showHistory: false, activeTab: '1' });
              }}
              className="user-history-popup"
              content={
                <Card style={{ maxHeight: 'calc(100vh - 200px)'}}>
                  <CardHeader>
                    <p className="float-left"
                      style={{
                        wordBreak: 'break-all',
                        maxWidth: '90%',
                      }}
                    >
                      <i className="fa fa-history"></i> Lịch sử người dùng
                    </p>
                    <span
                      className="float-right btn-close-popup"
                      title="Đóng cửa sổ"
                      style={{
                        fontSize: '15px',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        this.props.clearData();
                        this.setState({ showHistory: false, activeTab: '1' });
                      }}
                    ><i className="fa fa-close"></i></span>
                  </CardHeader>
                  <CardBody style={{ overflow: 'auto' }}>
                  <Nav tabs>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: this.state.activeTab === '1' })}
                        onClick={() => { this.toggle('1'); }}
                      >
                        <i className="fa fa-download"></i> <span className={this.state.activeTab === '1' ? '' : 'd-none'}> Tải tài liệu</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: this.state.activeTab === '2' })}
                        onClick={() => { this.toggle('2'); }}
                      >
                        <i className="fa fa-upload"></i> <span
                        className={this.state.activeTab === '2' ? '' : 'd-none'}> Đăng tài liệu</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: this.state.activeTab === '3' })}
                        onClick={() => { this.toggle('3'); }}
                      >
                        <i className="fa fa-money"></i> <span className={this.state.activeTab === '3' ? '' : 'd-none'}> Nạp tiền</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: this.state.activeTab === '4' })}
                        onClick={() => { this.toggle('4'); }}
                      >
                        <i className="fa fa-gift"></i> <span className={this.state.activeTab === '4' ? '' : 'd-none'}> Admin cộng tiền</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: this.state.activeTab === '5' })}
                        onClick={() => { this.toggle('5'); }}
                      >
                        <i className="fa fa-comments"></i> <span className={this.state.activeTab === '5' ? '' : 'd-none'}> Bình luận</span>
                      </NavLink>
                    </NavItem>
                  </Nav>
                  <TabContent activeTab={this.state.activeTab}>
                    {this.renderTabContent(
                      this.state.activeTab,
                      this.props.userHistory.get('data'),
                      this.props.loading
                    )}
                  </TabContent>
                  </CardBody>
                </Card>
              }
            />
          )}
        </Container>
      </Wrapper>
    );
  }
}

User.propTypes = {
  getDataInit: PropTypes.func,
  dataInit: PropTypes.object,
  history: PropTypes.any,
  deleteUser: PropTypes.any,
  getUsers: PropTypes.any,
  users: PropTypes.any,
  total: PropTypes.any,
};

export function mapDispatchToProps(dispatch) {
  return {
    getUsers: query => dispatch(getUsers(query)),
    getDataInit: () => dispatch(getDataInit()),
    getHistory: (id, type) => dispatch(getHistory(id, type)),
    clearData: () => dispatch(clearData()),
  };
}

const mapStateToProps = createStructuredSelector({
  users: makeSelectUsers(),
  total: makeSelectTotalUser(),
  loading: makeSelectLoading(),
  dataInit: makeSelectDataInit(),
  userHistory: makeSelectHistory(),
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
