/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import CKEditor from 'components/CKEditor';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Link } from 'react-router-dom';
import { isEqual, get } from 'lodash';
// import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import {
  Container,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Col,
  Row,
  Button,
  FormGroup,
  Label,
  Input,
  Alert,
} from 'reactstrap';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { fromJS } from 'immutable';
import {
  getUserDetail,
  updateUser,
  getDataInit,
  clearMessage,
  clearData,
} from './actions';
import {
  makeSelectMessage,
  makeSelectLoading,
  makeSelectUser,
  makeSelectDataInit,
  makeSelectError,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
import local from '../User/newLocal.json';

const Wrapper = styled.div`
  .rdw-editor-main {
    background: #fff;
    border: 1px solid #e4e7ea;
    border-radius: 2px;
    padding: 0 10px;
  }

  .rdw-editor-toolbar {
    border: 1px solid #e4e7ea;
  }
  .bod-picker {
    width: 100%;
    height: calc(2.0625rem + 2px);
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
    line-height: 1.5;
    color: #5c6873;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #e4e7ea;
    border-radius: 0.25rem;
  }
  .form-check-label {
    padding-top: calc(0.375rem + 1px);
    padding-bottom: calc(0.375rem + 1px);
    margin-bottom: 0;
    font-size: inherit;
    line-height: 1.5;
  }

  .row-alert {
    flex-direction: column;
    padding: 0 26px;
    text-align: left;
  }
  .row-button-control {
    flex-direction: column;
    padding: 0 26px;
    align-items: center;
    button {
      width: 70px;
      height: 35px;
    }
  }
  .card {
    height: 100%;
  }
  #checkBlockDate {
    margin: 0px;
    margin-top: 10px;
  }
  .react-datepicker-wrapper {
    margin-right: 10px;
    margin-left: 20px;
  }
  .row .group-block-download {
    .col-3,
    .col-2 {
      padding: 3px;
    }
  }
`;

/* eslint-disable react/prefer-stateless-function */
export class UserEdit extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      formData: fromJS({
        name: '',
        email: '',
        status: 1,
        deposit: 0,
        role: '',
        phone: '',
        city: '',
        level: '',
        school: '',
        bod: '',
        district: '',
      }),
      originData: {
        name: '',
        description: '',
      },
      error: {},
    };
    this.resetForm = this.resetForm.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeEditor = this.onChangeEditor.bind(this);
    this.onChangeMultiple = this.onChangeMultiple.bind(this);
  }

  componentWillMount() {
    if (!this.props.location.search.split('=')[1]) {
      this.props.getDataInit(this.props.match.params.id);
    }
    this.props.getUserDetail(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.user, nextProps.user) && !nextProps.loading) {
      const updateNote = this.props.location.search.split('=')[1];
      const formData = !updateNote
        ? this.mappingUserToForm(nextProps.user)
        : fromJS({ [updateNote]: nextProps.user.get(updateNote, '') });
      this.setState({
        originData: formData,
        formData,
      });
    }
  }

  componentWillUnmount() {
    this.props.clearData();
    this.props.clearMessage();
  }

  mappingUserToForm(data) {
    return data
      .set('notifyStatus', data.get('notifyStatus') || '0')
      .set('notifyText', data.get('notifyText') || '')
      .set('blockFrom', data.get('blockFrom') ? moment(data.get('blockFrom')) : '')
      .delete('createdAt')
      .delete('updatedAt')
      .delete('numOfDownloaded')
      .delete('numOfUploaded');
  }

  mappingUserToSave(data) {
    const newData = data
      .set('money', `${parseInt(this.state.formData.get('money', 0)) + parseInt(this.state.formData.get('deposit'))}`)
      .delete('blockDownloadCategories')
      .delete('blockDownloadCollections')
      .delete('blockDownloadSubjects')
      .delete('blockFrom')
      .delete('status')
      .delete('email')
      .delete('deposit');
    const blockUser = {
      status: data.get('status'),
    };
    if (data.get('status') === '3') {
      blockUser.blockFrom = data.get('blockFrom');
    }
    if (data.get('status') === '4') {
      blockUser.blockDownloadCategories = data.get('blockDownloadCategories', []).join(',');
      blockUser.blockDownloadSubjects = data.get('blockDownloadCollections', []).join(',');
      blockUser.blockDownloadCollections = data.get('blockDownloadSubjects', []).join(',');
    }
    const dataBlock = { ...blockUser };
    Object.keys(dataBlock).forEach(v => {
      if (!blockUser[v]) delete blockUser[v];
    });
    return {
      user: newData.toJS(),
      blockUser,
    };
  }

  onChangeEditor(evt) {
    const newContent = evt.editor.getData();
    this.setState({
      formData: this.state.formData.set('notifyText', newContent),
    });
  }

  onChangeMultiple(e) {
    const { name, selectedOptions } = e.currentTarget;
    const newFormData = this.state.formData.set(name, fromJS(Array.prototype.slice.call(selectedOptions).map(i => i.value)));
    this.setState({
      formData: newFormData,
    });
  }

  resetForm() {
    this.setState({ formData: this.state.originData, error: {} });
    this.props.clearMessage();
  }

  onChange(e) {
    const { name, value, checked } = e.currentTarget;
    let newData;
    const status = this.props.user.get('status');
    switch (name) {
      case 'notifyStatus':
        newData = this.state.formData.set(name, checked ? '1' : '0');
        break;
      case 'checkBlocked':
        newData = this.state.formData.set('status', checked ? '0' : status);
        break;
      case 'checkBlockDate':
        newData = this.state.formData.set('status', checked ? '3' : status);
        break;
      case 'checkBlockDownload':
        newData = this.state.formData.set('status', checked ? '4' : status);
        break;
      default:
        newData = this.state.formData.set(name, value);
    }
    console.log(newData.get('status'));
    this.setState({ formData: newData });
  }

  onSubmit() {
    this.props.clearMessage();
    const error = {};
    Object.keys(this.state.formData.toJS()).forEach(key => {
      if (key !== 'money' && !this.state.formData.toJS()[key]) {
        error[key] = 'Thông tin còn thiếu';
      }
    });
    if (!Object.keys(error).length) {
      if (!this.props.location.search.split('=')[1]) {
        const { user, blockUser } = this.mappingUserToSave(this.state.formData);
        this.props.updateUser(
          user,
          blockUser,
          this.props.match.params.id,
        );
      } else {
        this.props.updateUser(this.state.formData, this.props.match.params.id);
      }
    } else {
      this.setState({ error });
    }
  }

  clearMessage() {
    this.props.clearMessage();
  }

  render() {
    const updateNote = this.props.location.search.split('=')[1];
    const message = this.props.message || this.props.error || '';
    const AlertComponent = (
      <Alert
        color={this.props.message ? 'info' : 'danger'}
        isOpen={!!message}
        toggle={() => this.props.clearMessage()}
      >
        {message}
      </Alert>
    );
    return (
      <Wrapper>
        <Row>
          <Col xl={12}>
            <Breadcrumb>
              <BreadcrumbItem>
                <Link to="/">Trang chủ</Link>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <Link to="/users">Thành viên</Link>
              </BreadcrumbItem>
              <BreadcrumbItem active>
                {updateNote ? 'Xem, Sửa ghi chú' : 'Cập nhật thành viên'}
              </BreadcrumbItem>
            </Breadcrumb>
          </Col>
        </Row>
        {updateNote ? (
          <Container fluid className="note-update">
            <Row className="row-alert">{AlertComponent}</Row>
            <Row>
              <Col xl={6}>
                <Card>
                  <CardHeader>
                    <i className="fa fa-align-justify" /> Thông tin chung
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col xs="12">
                        <FormGroup row>
                          <Label htmlFor="note" sm={3}>
                            {updateNote === 'note1' ? 'Ghi chú:' : 'Ghi chú 2:'}
                          </Label>
                          <Col sm={9}>
                            <Input
                              sm={10}
                              rows={6}
                              type="textarea"
                              id="note"
                              name={updateNote}
                              onChange={this.onChange}
                              value={this.state.formData.get(updateNote, '')}
                              className={
                                this.state.error[updateNote] && 'is-invalid'
                              }
                            />
                            <div className="invalid-feedback">
                              {this.state.error[updateNote]}
                            </div>
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={3}>Thao tác:</Col>
                      <Col sm={9}>
                        <div
                          className="float-left"
                          style={{ marginRight: '10px' }}
                        >
                          <Button
                            block
                            color="primary"
                            size="sm"
                            onClick={this.onSubmit}
                          >
                            Thay đổi
                          </Button>
                        </div>
                        <div className="float-left">
                          <Button
                            block
                            color="danger"
                            size="sm"
                            onClick={this.resetForm}
                          >
                            Nhập lại
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        ) : (
          <Container fluid>
            <Row className="row-alert">{AlertComponent}</Row>
            <Row>
              {/* Thông tin chung */}
              <Col xl={4}>
                <Card>
                  <CardHeader>
                    <i className="fa fa-align-justify" /> Thông tin chung
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col xs="12">
                        <FormGroup row>
                          <Label htmlFor="email" sm={4}>
                            Email:
                          </Label>
                          <Col sm={8}>
                            <Input
                              sm={10}
                              type="text"
                              id="email"
                              name="email"
                              required
                              onChange={this.onChange}
                              value={this.state.formData.get('email', '')}
                              className={this.state.error.email && 'is-invalid'}
                              disabled
                            />
                            <div className="invalid-feedback">
                              {this.state.error.name}
                            </div>
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs="12">
                        <FormGroup row>
                          <Label htmlFor="name" sm={4}>
                            Tên đầy đủ:
                          </Label>
                          <Col sm={8}>
                            <Input
                              type="text"
                              id="name"
                              name="name"
                              required
                              onChange={this.onChange}
                              value={this.state.formData.get('name', '')}
                              className={this.state.error.name && 'is-invalid'}
                            />
                            <div className="invalid-feedback">
                              {this.state.error.name}
                            </div>
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs="12">
                        <FormGroup row>
                          <Label htmlFor="phone" sm={4}>
                            Số điện thoại:
                          </Label>
                          <Col sm={8}>
                            <Input
                              type="text"
                              id="phone"
                              name="phone"
                              required
                              onChange={this.onChange}
                              value={this.state.formData.get('phone', '')}
                              className={this.state.error.phone && 'is-invalid'}
                            />
                            <div className="invalid-feedback">
                              {this.state.error.phone}
                            </div>
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs="12">
                        <FormGroup row>
                          <Label htmlFor="bod" sm={4}>
                            Năm sinh:
                          </Label>
                          <Col sm={5}>
                            <Input
                              type="select"
                              name="bod"
                              id="bod"
                              value={this.state.formData.get('bod')}
                              placeholder="-- Chọn năm sinh --"
                              onChange={this.onChange}
                              required
                              className={this.state.error.bod && 'is-invalid'}
                            >
                              {Array(81)
                                .fill(new Date().getFullYear() - 80)
                                .map((y, idx) => (
                                  <option
                                    value={`${y + idx}`}
                                    key={y + idx}
                                  >{`${y + idx}`}</option>
                                ))}
                            </Input>
                            <div className="invalid-feedback">
                              {this.state.error.bod}
                            </div>
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs="12">
                        <FormGroup row>
                          <Label htmlFor="role" sm={4}>
                            Bạn là:
                          </Label>
                          <Col sm={8}>
                            <Input
                              type="select"
                              name="role"
                              id="role"
                              value={this.state.formData.get('role', '')}
                              placeholder="-- Chọn chức danh --"
                              onChange={this.onChange}
                              required
                              className={this.state.error.role && 'is-invalid'}
                            >
                              <option value="member">Member</option>
                              <option value="admin">Admin</option>
                            </Input>
                            <div className="invalid-feedback">
                              {this.state.error.role}
                            </div>
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs="12">
                        <FormGroup row>
                          <Label htmlFor="level" sm={4}>
                            Lớp:
                          </Label>
                          <Col sm={5}>
                            <Input
                              type="select"
                              name="level"
                              id="level"
                              value={this.state.formData.get('level', '')}
                              placeholder="-- Chọn lớp học --"
                              onChange={this.onChange}
                              required
                              className={this.state.error.level && 'is-invalid'}
                            >
                              {this.props.dataInit.classes.map(i => (
                                <option value={i.id} key={i.id}>
                                  {i.name}
                                </option>
                              ))}
                            </Input>
                            <div className="invalid-feedback">
                              {this.state.error.level}
                            </div>
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs="12">
                        <FormGroup row>
                          <Label htmlFor="city" sm={4}>
                            Thành phố:
                          </Label>
                          <Col sm={8}>
                            <Input
                              type="select"
                              name="city"
                              id="city"
                              value={this.state.formData.get('city', '')}
                              placeholder="-- Chọn thành phố --"
                              onChange={this.onChange}
                              required
                              className={this.state.error.city && 'is-invalid'}
                            >
                              {local.map(city => (
                                <option value={city.code} key={city.code}>
                                  {city.name}
                                </option>
                              ))}
                            </Input>
                            <div className="invalid-feedback">
                              {this.state.error.city}
                            </div>
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs="12">
                        <FormGroup row>
                          <Label htmlFor="district" sm={4}>
                            Quận/Huyện:
                          </Label>
                          <Col sm={8}>
                            <Input
                              type="select"
                              name="district"
                              id="district"
                              value={this.state.formData.get('district', '')}
                              placeholder="-- Chọn Quận/Huyện --"
                              onChange={this.onChange}
                              required
                              className={
                                this.state.error.district && 'is-invalid'
                              }
                            >
                              {get(
                                local.find(
                                  city =>
                                    city.code ===
                                    this.state.formData.get('city'),
                                ),
                                'districts',
                                [],
                              ).map(district => (
                                <option
                                  value={district.name}
                                  key={district.name}
                                >
                                  {district.name}
                                </option>
                              ))}
                            </Input>
                            <div className="invalid-feedback">
                              {this.state.error.district}
                            </div>
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs="12">
                        <FormGroup row>
                          <Label htmlFor="school" sm={4}>
                            Trường học:
                          </Label>
                          <Col sm={8}>
                            <Input
                              type="select"
                              name="school"
                              value={this.state.formData.get('school', '')}
                              placeholder="-- Chọn trường --"
                              onChange={this.onChange}
                              required
                              className={
                                this.state.error.school && 'is-invalid'
                              }
                            >
                              <option value="Quang Trung">Quang Trung</option>
                            </Input>
                            <div className="invalid-feedback">
                              {this.state.error.school}
                            </div>
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              {/* Chức năng thành viên */}
              <Col xl={8}>
                <Card>
                  <CardHeader>
                    <i className="fa fa-align-justify" /> Chức năng thành viên
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col xs="12">
                        <FormGroup row>
                          <Label htmlFor="group" sm={3}>
                            Nhóm thành viên:
                          </Label>
                          <Col sm={5}>
                            <Input
                              type="select"
                              name="group"
                              options={[
                                { label: 'Thành viên', value: 'member' },
                                { label: 'Admin', value: 'admin' },
                              ]}
                              value={this.state.formData.get('role', '')}
                              placeholder="-- Chọn nhóm thành viên --"
                              onChange={this.onChange}
                              required
                              className={this.state.error.role && 'is-invalid'}
                            >
                              <option value="member">Thành viên</option>
                              <option value="admin">Admin</option>
                            </Input>
                            <div className="invalid-feedback">
                              {this.state.error.role}
                            </div>
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs="12">
                        <FormGroup row>
                          <Label htmlFor="name" sm={3}>
                            Cộng tiền:
                          </Label>
                          <Col sm={5}>
                            <Input
                              type="number"
                              name="deposit"
                              id="deposit"
                              onChange={this.onChange}
                              value={this.state.formData.get('deposit', '')}
                              className={this.state.error.deposit && 'is-invalid'}
                            />
                            <div className="invalid-feedback">
                              {this.state.error.deposit}
                            </div>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm={3}> Block tài khoản: </Label>
                          <Col sm={{ size: 9 }}>
                            <FormGroup check>
                              <Label check>
                                <Input
                                  type="checkbox"
                                  id="blocked"
                                  name="checkBlocked"
                                  onChange={this.onChange}
                                  checked={this.state.formData.get('status') === '0' ? true : false}
                                  />
                                <b>Khóa ngay</b>
                              </Label>
                            </FormGroup>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm={3}> Khóa tải:</Label>
                          <Col sm={{ size: 3 }}>
                            <Input
                              type="checkbox"
                              id="checkBlockDate"
                              name="checkBlockDate"
                              onChange={this.onChange}
                              checked={this.state.formData.get('status') === '3' ? true : false}
                            />
                            <DatePicker
                              selected={this.state.formData.get('blockFrom', '')}
                              onChange={date =>
                                this.onChange({
                                  currentTarget: {
                                    name: 'blockFrom',
                                    value: date,
                                  },
                                })
                              }
                              disabled={this.state.formData.get('status') !== '3' ? true : false}
                              peekNextMonth
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              placeholderText="DD/MM/YYYY"
                              tabIndex={1000}
                              className="bod-picker"
                              dateFormat="DD/MM/YYYY"
                            />
                          </Col>
                          <Col sm={6}>
                            Chọn ngày tài khoản sẽ bị khóa ( Xóa trắng để khóa
                            ngay tài khoản)
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm={4}> Khóa Download theo danh mục:</Label>
                          <Label check>
                            <Input
                              type="checkbox"
                              id="checkBlockDownload"
                              name="checkBlockDownload"
                              onChange={this.onChange}
                              checked={this.state.formData.get('status') === '4' ? true : false}
                            />&nbsp;
                          </Label>
                        </FormGroup>
                        <Row className="group-block-download">
                          <Col xs="3">
                            <FormGroup>
                              <Label htmlFor="blockDownloadCategoris">Danh mục</Label>
                              <Input
                                onChange={this.onChangeMultiple}
                                type="select"
                                name="blockDownloadCategories"
                                id="blockDownloadCategories"
                                multiple
                                disabled={this.state.formData.get('status') !== '4' ? true : false}
                                value={this.state.formData.get('blockDownloadCategories', fromJS([])).toJS()}
                              >
                                {get(this.props, 'dataInit.categories', []).map(
                                  i => (
                                    <option key={i.id} value={i.id}>
                                      {i.name}
                                    </option>
                                  ),
                                )}
                              </Input>
                            </FormGroup>
                          </Col>
                          <Col xs="2">
                            <FormGroup>
                              <Label htmlFor="blockDownloadSubjects">Môn học</Label>
                              <Input
                                onChange={this.onChangeMultiple}
                                type="select"
                                name="blockDownloadSubjects"
                                id="blockDownloadSubjects"
                                multiple
                                disabled={this.state.formData.get('status') !== '4' ? true : false}
                                value={this.state.formData.get('blockDownloadSubjects', fromJS([])).toJS()}
                              >
                                {get(this.props, 'dataInit.subjects', []).map(
                                  i => (
                                    <option key={i.id} value={i.id}>
                                      {i.name}
                                    </option>
                                  ),
                                )}
                              </Input>
                            </FormGroup>
                          </Col>
                          <Col xs="2">
                            <FormGroup>
                              <Label htmlFor="classes">Lớp</Label>
                              <Input
                                onChange={this.onChangeMultiple}
                                type="select"
                                name="blockDownloadClasses"
                                id="blockDownloadClasses"
                                multiple
                                disabled={this.state.formData.get('status') !== '4' ? true : false}
                                value={this.state.formData.get('blockDownloadClasses', fromJS([])).toJS()}
                              >
                                {get(this.props, 'dataInit.classes', []).map(
                                  i => (
                                    <option key={i.id} value={i.id}>
                                      {i.name}
                                    </option>
                                  ),
                                )}
                              </Input>
                            </FormGroup>
                          </Col>
                          <Col xs="2">
                            <FormGroup>
                              <Label htmlFor="blockDownloadYearschool">Năm học</Label>
                              <Input
                                onChange={this.onChangeMultiple}
                                type="select"
                                name="blockDownloadYearschool"
                                id="blockDownloadYearschool"
                                multiple
                                disabled={this.state.formData.get('status') !== '4' ? true : false}
                                value={this.state.formData.get('blockDownloadYearschool', fromJS([])).toJS()}
                              >
                                {Array(21)
                                  .fill(new Date().getFullYear() - 20)
                                  .map((v, idx) => (
                                    <option
                                      value={`${v + idx} - ${v + idx + 1}`}
                                      key={v + idx}
                                    >
                                      {`${v + idx} - ${v + idx + 1}`}
                                    </option>
                                  ))}
                              </Input>
                            </FormGroup>
                          </Col>
                          <Col xs="3">
                            <FormGroup>
                              <Label htmlFor="blockDownloadCollections"> Bộ sưu tập</Label>
                              <Input
                                onChange={this.onChangeMultiple}
                                type="select"
                                name="blockDownloadCollections"
                                id="blockDownloadCollections"
                                multiple
                                disabled={this.state.formData.get('status') !== '4' ? true : false}
                                value={this.state.formData.get('blockDownloadCollections', fromJS([])).toJS()}
                              >
                                {get(this.props, 'dataInit.collections', [])
                                  .map(i => (
                                    <option key={i.id} value={i.id}>
                                      {i.name}
                                    </option>))}
                              </Input>
                            </FormGroup>
                          </Col>
                        </Row>
                        <FormGroup row>
                          <Label for="checkbox2" sm={3}>
                            Thông báo popup:
                          </Label>
                          <Label check>
                            <Input
                              type="checkbox"
                              id=""
                              name="notifyStatus"
                              checked={this.state.formData.get('notifyStatus') === '1' ? true : false}
                              onChange={this.onChange}
                            />&nbsp;
                          </Label>
                        </FormGroup>
                        <FormGroup>
                          <CKEditor
                            activeClass="notifyText"
                            name="notifyText"
                            content={this.state.formData.get('notifyText')}
                            events={{
                              "change": this.onChangeEditor
                            }}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row className="row-button-control">
              <CardFooter>
                <div style={{ marginLeft: '10px' }}>
                  <Button
                    block
                    color="primary"
                    size="sm"
                    onClick={this.onSubmit}
                  >
                    Lưu
                  </Button>
                </div>
              </CardFooter>
            </Row>
          </Container>
        )}
      </Wrapper>
    );
  }
}

UserEdit.propTypes = {
  loading: PropTypes.bool,
  clearData: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    updateUser: (data, blockUser, id) => dispatch(updateUser(data, blockUser, id)),
    getUserDetail: id => dispatch(getUserDetail(id)),
    getDataInit: () => dispatch(getDataInit()),
    clearMessage: () => dispatch(clearMessage()),
    clearData: () => dispatch(clearData()),
  };
}

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  message: makeSelectMessage(),
  user: makeSelectUser(),
  dataInit: makeSelectDataInit(),
  error: makeSelectError(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'userEdit', reducer });
const withSaga = injectSaga({ key: 'userEdit', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(UserEdit);
