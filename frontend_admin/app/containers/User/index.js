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
} from 'reactstrap';
import moment from 'moment';
import styled from 'styled-components';
import { HeadSort, PaginationTable } from 'components/Table';

import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { getToken } from 'services/auth';
import { getUsers } from './actions';
import {
  makeSelectUsers,
  makeSelectLoading,
  makeSelectTotalUser,
} from './selectors';
import reducer from './reducer';
import saga from './saga';

const Wrapper = styled.div`
  table {
    font-size: 11px;
    tr > td, tr > th {
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
`;

function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(String(email).toLowerCase());
}

/* eslint-disable react/prefer-stateless-function */
export class User extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      currentPage: 1,
      editorState: EditorState.createEmpty(),
    };
    this.size = 10;
    this.maxPages = 11;
    this.sort = this.sort.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.search = this.search.bind(this);
    this.onSelectPage = this.onSelectPage.bind(this);
    this.handleChangeFile = this.handleChangeFile.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleChangeValue = this.handleChangeValue.bind(this);
    this.onEditorStateChange = this.onEditorStateChange.bind(this);
    this.quickSubmit = this.quickSubmit.bind(this);
  }

  componentWillMount() {
    // get subjects
    this.props.getUsers({
      sort: 'createdAt.desc',
      offset: 0,
      size: this.size,
    });
  }

  onEditorStateChange(editorState) {
    this.setState({
      editorState,
      quickContent: 
        draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
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
          <td>{item.money}</td>
          <td>{item.group}</td>
          <td>{item.status === 1
            ? <Badge style={{ fontSize: '11px' }} color="success">Active</Badge>
            : <Badge style={{ fontSize: '11px' }} color="warning">Pending</Badge>}</td>
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

  handleChangeFile(e) {
    const file = e.target.files[0];
    const fileReader = new FileReader();  
    fileReader.onloadend = (e) => {
      const content = fileReader.result;
      const validatedEmail = content.split("\n").filter((email) => validateEmail(email));
      this.setState({ quickActive: true, quickList: validatedEmail });
    };
    fileReader.readAsText(file);
  }

  handleOnChange(e) {
    this.setState({
      quickActive: e.target.value,
    });
  }

  handleChangeValue(e) {
    this.setState({
      quickContent: e.target.value,
    });
  }

  quickSubmit() {
    const { quickActive, quickContent, quickList, quickMoney, quickBlock, quickDate } = this.state;
    if (quickActive && quickList) {
      const options = {
        headers: {
          ['x-access-token']: getToken(),
        }
      }
      if (quickActive === '3') {
        axios.put('/api/users/:userId/block', {
          "status": "3",
	"blockTo": "10-10-2018",
	"blockFrom": "01-10-2017"
        }, options).then((res) => {
          console.log(res, 123);
        })
      }
      console.log(quickActive, quickContent, quickList, quickMoney, quickBlock, quickDate, 123);
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
                  <Row style={{ marginBottom: '15px' }}>
                    <Col md="3">
                      <InputGroup>
                        <Input onChange={this.onSearch} type="text" id="search-table" name="search-table-user" bsSize="sm" />
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
                    <Label for="exampleFile" sm={2}>File:</Label>
                    <Col sm={10}>
                      <Input type="file" name="file" id="exampleFile" onChange={this.handleChangeFile} />
                      <FormText color="muted">
                        Tải lên danh sách các email cần cập nhật.
                      </FormText>
                    </Col>
                  </Row>
                  {this.state.quickActive ? 
                    (<div><Row>
                      <Label for="exampleFile" md={2}>Lựa chọn:</Label>
                      <Col md="10">
                        {[{
                          text: 'Trừ hết tiền',
                          value: 1
                        },
                        {
                          text: 'Cộng tiền',
                          value: 2 
                        },
                        {
                          text: 'Khóa sử dụng tiền',
                          value: 3 
                        },
                        {
                          text: 'Thông báo',
                          value: 4 
                        },
                        {
                          text: 'Ghi chú 1',
                          value: 5 
                        }].map((opt) => (<FormGroup check key={opt.value}>
                          <Label check>
                            <Input type="radio" name="radio1" value={opt.value} onChange={this.handleOnChange} />{' '}
                            {opt.text}
                          </Label>
                        </FormGroup>))}
                      </Col>
                    </Row>
                    <Row>
                    <Label for="exampleFile" sm={2}>{' '}</Label>
                    <Col sm={10}>
                    {this.state.quickActive === '2' ?
                        <input type="number" className="rdw-editor-main" onChange={this.handleChangeValue} /> :
                        this.state.quickActive === '4' || this.state.quickActive === '5'
                         ? <Editor
                          editorState={this.state.editorState}
                          name="description"
                          onEditorStateChange={this.onEditorStateChange}
                        /> :
                        this.state.quickActive === '3' ? <div>
                          <div>
                            <DatePicker className="rdw-editor-main" onChange={(date) => this.setState({ quickDate: date })} />
                          
                          <FormText color="muted">
                        Chọn ngày tài khoản sẽ bị khóa ( Xóa trắng để Khóa ngay tài khoản )
          </FormText>
          </div>
                        <div>
                          <input type="number" className="rdw-editor-main" placeholder="Số tiền mở khóa" onChange={(e) => this.setState({ quickMoney: e.target.value })} />
                        
                          <Label check style={{ 
                            marginLeft: '50px',
    marginTop: '20px',
    marginBottom: '20px',
                          }}
    
>
                            <Input type="checkbox" onChange={(e) => this.setState({ quickBlock: e.target.checked })} />{' '}
                            Khóa / Mở khóa
                          </Label>
                        </div>
                        <Editor
                          editorState={this.state.editorState}
                          name="description"
                          onEditorStateChange={this.onEditorStateChange}
                        />
                          </div> : null}
                        </Col>
                    </Row>
                    <Row>
                    <Label for="exampleFile" sm={2}>{' '}</Label>
                    <Col sm={2}>
                      <Button
                        block
                        color="success"
                        size="sm"
                        onClick={this.quickSubmit}
                        style={{ marginTop: '15px' }}
                      >Thực hiện</Button>
                    </Col>
                  </Row>
                    </div>)
                    : null }
                </CardHeader>
                <CardBody>
                  <Table responsive hover striped>
                    <thead>
                      <tr>
                        <th scope="col">#</th>
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
