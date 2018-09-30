/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { isEqual, get } from 'lodash';
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
  CardFooter,
  Col,
  Row,
  Button,
  FormGroup,
  Label,
  Input,
  Alert,
} from 'reactstrap';
import Select from 'react-select';

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
} from './selectors';
import reducer from './reducer';
import saga from './saga';
import local from '../User/newLocal.json';

/* eslint-disable react/prefer-stateless-function */
export class ClassCreate extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      formData: fromJS({
        name: '',
        email: '',
        status: 1,
        money: 0,
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
      editorState: EditorState.createEmpty(),
    };
    // this.resetForm = this.resetForm.bind(this);
    this.onChange = this.onChange.bind(this);
    // this.onSubmit = this.onSubmit.bind(this);
    this.onEditorStateChange = this.onEditorStateChange.bind(this);
  }

  componentWillMount() {
    this.props.getDataInit(this.props.match.params.id);
    this.props.getUserDetail(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.user, nextProps.user) && !nextProps.loading) {
      this.setState({
        originData: nextProps.user,
        formData: nextProps.user,
      });
    }
  }

  componentWillUnmount() {
    this.props.clearData();
    this.props.clearMessage();
  }

  onEditorStateChange(editorState) {
    this.setState({
      editorState,
      formData: this.state.formData.set(
        'description',
        draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())),
      ),
    });
  }

  resetForm() {
    this.setState({ formData: this.state.originData, error: {} });
    this.props.clearMessage();
  }

  onChange(e) {
    const { name, value } = e.currentTarget;
    this.setState({ formData: this.state.formData.set(name, value) });
  }

  onSubmit() {
    const error = {};
    Object.keys(this.state.formData).forEach(key => {
      if (!this.state.formData[key]) {
        error[key] = 'Thông tin còn thiếu';
      }
    });
    if (!Object.keys(error).length) {
      this.props.updateUser(this.state.formData, this.props.match.params.id);
    } else {
      this.setState({ error });
    }
  }

  clearMessage() {
    this.props.clearMessage();
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Breadcrumb>
              <BreadcrumbItem>
                <Link to="/">Trang chủ</Link>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <Link to="/users">Thành viên</Link>
              </BreadcrumbItem>
              <BreadcrumbItem active>Xem chi tiết</BreadcrumbItem>
            </Breadcrumb>
          </Col>
        </Row>
        <Container fluid>
          <Row>
            <Alert
              color="danger"
              isOpen={!!this.props.message}
              toggle={() => this.props.clearMessage()}
            >
              {this.props.message}
            </Alert>
          </Row>
          <Row>
            {/* Thông tin chung */}
            <Col xl={5}>
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify" /> Thông tin chung
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col xs="12">
                      <FormGroup row>
                        <Label htmlFor="email" sm={3}>
                          Email:
                        </Label>
                        <Col sm={9}>
                          <Input
                            sm={10}
                            type="text"
                            id="email"
                            name="email"
                            required
                            onChange={this.onChange}
                            value={this.state.formData.get('email', '')}
                            className={this.state.error.email && 'is-invalid'}
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
                        <Label htmlFor="name" sm={3}>
                          Tên đầy đủ:
                        </Label>
                        <Col sm={9}>
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
                        <Label htmlFor="phone" sm={3}>
                          Số điện thoại:
                        </Label>
                        <Col sm={9}>
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
                        <Label htmlFor="bod" sm={3}>
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
                                <option value={`${y + idx}`} key={y + idx}>{`${y +
                                  idx}`}</option>
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
                        <Label htmlFor="role" sm={3}>
                          Bạn là:
                        </Label>
                        <Col sm={9}>
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
                        <Label htmlFor="level" sm={3}>
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
                        <Label htmlFor="city" sm={3}>
                          Thành phố:
                        </Label>
                        <Col sm={9}>
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
                        <Label htmlFor="district" sm={3}>
                          Quận/Huyện:
                        </Label>
                        <Col sm={9}>
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
                                  city.code === this.state.formData.get('city'),
                              ),
                              'districts',
                              [],
                            ).map(district => (
                              <option value={district.name} key={district.name}>
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
                        <Label htmlFor="school" sm={3}>
                          Trường học:
                        </Label>
                        <Col sm={9}>
                          <Input
                            type="select"
                            name="school"
                            value={this.state.formData.get('school', '')}
                            placeholder="-- Chọn trường --"
                            onChange={this.onChange}
                            required
                            className={this.state.error.school && 'is-invalid'}
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
            <Col xl={7}>
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify" /> Chức năng thành viên
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col xs="12">
                      <FormGroup row>
                        <Label htmlFor="name" sm={3}>
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
                            value={this.state.formData.get('group', '')}
                            placeholder="-- Chọn nhóm thành viên --"
                            onChange={this.onChange}
                            required
                            className={this.state.error.group && 'is-invalid'}
                          >
                            <option value="member">Thành viên</option>
                            <option value="admin">Admin</option>
                          </Input>
                          <div className="invalid-feedback">
                            {this.state.error.group}
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
                            name="money"
                            id="money"
                            onChange={this.onChange}
                            value={this.state.formData.get('money', '')}
                            className={this.state.error.money && 'is-invalid'}
                          />
                          <div className="invalid-feedback">
                            {this.state.error.money}
                          </div>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="checkbox2" sm={3}>
                          Block tài khoản:
                        </Label>
                        <Col sm={{ size: 9 }}>
                          <FormGroup check>
                            <Label check>
                              <Input type="checkbox" id="checkbox2" />
                              <b>Khóa ngay</b>
                            </Label>
                          </FormGroup>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="checkbox2" sm={3}>
                          Khóa tải:
                        </Label>
                        <Col sm={{ size: 3 }}>
                          <Input
                            type="text"
                            id=""
                            name=""
                            placeholder="dd/mm/yyyy"
                          />
                        </Col>
                        <Col sm={6}>Chọn ngày tài khoản sẽ bị khóa ( Xóa trắng để khóa
                          ngay tài khoản)</Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="checkbox2" sm={4}>
                          Khóa Download theo danh mục:
                        </Label>
                        <Col sm={{ size: 5 }}>
                          <FormGroup check>
                            <Label check>
                              <Input type="checkbox" id="" name="" />
                            </Label>
                          </FormGroup>
                        </Col>
                      </FormGroup>
                      <Row>
                        <Col xs="3">
                          <FormGroup>
                            <Label htmlFor="collection-categories">
                              Danh mục
                            </Label>
                            <Input
                              onChange={this.onChangeMultiple}
                              type="select"
                              name="cateIds"
                              id="collection-categories"
                              multiple
                              className={
                                this.state.error.cateIds && 'is-invalid'
                              }
                              value={this.state.formData.cateIds}
                            >
                              {get(this.props, 'dataInit.categories', []).map(
                                i => (
                                  <option key={i.id} value={i.id}>
                                    {i.name}
                                  </option>
                                ),
                              )}
                            </Input>
                            <div className="invalid-feedback">
                              {this.state.error.cateIds}
                            </div>
                          </FormGroup>
                        </Col>
                        <Col xs="3">
                          <FormGroup>
                            <Label htmlFor="collection-subjects">Môn học</Label>
                            <Input
                              onChange={this.onChangeMultiple}
                              type="select"
                              name="subjectIds"
                              id="collection-subjects"
                              multiple
                              className={
                                this.state.error.subjectIds && 'is-invalid'
                              }
                              value={this.state.formData.subjectIds}
                            >
                              {get(this.props, 'dataInit.subjects', []).map(
                                i => (
                                  <option key={i.id} value={i.id}>
                                    {i.name}
                                  </option>
                                ),
                              )}
                            </Input>
                            <div className="invalid-feedback">
                              {this.state.error.subjectIds}
                            </div>
                          </FormGroup>
                        </Col>
                        <Col xs="3">
                          <FormGroup>
                            <Label htmlFor="collection-classes">Lớp</Label>
                            <Input
                              onChange={this.onChangeMultiple}
                              type="select"
                              name="classIds"
                              id="collection-classes"
                              multiple
                              className={
                                this.state.error.classIds && 'is-invalid'
                              }
                              value={this.state.formData.classIds}
                            >
                              {get(this.props, 'dataInit.classes', []).map(
                                i => (
                                  <option key={i.id} value={i.id}>
                                    {i.name}
                                  </option>
                                ),
                              )}
                            </Input>
                            <div className="invalid-feedback">
                              {this.state.error.classIds}
                            </div>
                          </FormGroup>
                        </Col>
                        <Col xs="3">
                          <FormGroup>
                            <Label htmlFor="collection-school-year">
                              Năm học
                            </Label>
                            <Input
                              onChange={this.onChangeMultiple}
                              type="select"
                              name="yearSchools"
                              id="collection-school-year"
                              multiple
                              className={
                                this.state.error.yearSchools && 'is-invalid'
                              }
                              value={this.state.formData.yearSchools}
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
                            <div className="invalid-feedback">
                              {this.state.error.yearSchools}
                            </div>
                          </FormGroup>
                        </Col>
                      </Row>
                      <FormGroup row>
                        <Label for="checkbox2" sm={3}>
                          Thông báo popup:
                        </Label>
                        <Col sm={{ size: 5 }}>
                          <FormGroup check>
                            <Label check>
                              <Input type="checkbox" id="" name="" />
                            </Label>
                          </FormGroup>
                        </Col>
                      </FormGroup>
                      <FormGroup>
                        <Editor
                          editorState={this.state.editorState}
                          name="description"
                          onEditorStateChange={this.onEditorStateChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <CardFooter>
              <div className="float-right" style={{ marginLeft: '10px' }}>
                <Button block color="primary" size="sm" onClick={this.onSubmit}>
                  Lưu
                </Button>
              </div>
            </CardFooter>
          </Row>
        </Container>
      </div>
    );
  }
}

ClassCreate.propTypes = {
  loading: PropTypes.bool,
};

export function mapDispatchToProps(dispatch) {
  return {
    updateUser: (data, id) => dispatch(updateUser(data, id)),
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
)(ClassCreate);
