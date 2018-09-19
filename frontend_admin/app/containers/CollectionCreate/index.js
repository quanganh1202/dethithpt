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
import { createCollection, clearMessage, getInitData } from './actions';
import {
  makeSelectMessage,
  makeSelectLoading,
  makeSelectInitData,
} from './selectors';
import reducer from './reducer';
import saga from './saga';

const dataInit = {
  name: '',
  description: '',
  cateIds: [],
  subjectIds: [],
  classIds: [],
  yearSchools: [],
};

/* eslint-disable react/prefer-stateless-function */
export class CollectionCreate extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      formData: {
        name: '',
        description: '',
        cateIds: [],
        subjectIds: [],
        classIds: [],
        yearSchools: [],
      },
      error: {},
    };
    this.resetForm = this.resetForm.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeMultiple = this.onChangeMultiple.bind(this);
  }

  componentWillMount() {
    this.props.getInitData();
  }

  resetForm() {
    this.setState({ formData: dataInit, error: {} });
    this.props.clearMessage();
  }

  onChange(e) {
    const { name, value } = e.currentTarget;
    this.setState({ formData: { ...this.state.formData, [name]: value } })
  }

  onChangeMultiple(e) {
    const { name, selectedOptions } = e.currentTarget;
    this.setState({
      formData: {
        ...this.state.formData,
        [name]: Array.prototype.slice.call(selectedOptions).map((i) => i.value),
      },
    })
  }

  mappingData(data) {
    return {
      ...data,
      cateIds: data.cateIds.join(','),
      subjectIds: data.subjectIds.join(','),
      classIds: data.classIds.join(','),
      yearSchools: data.yearSchools.join(','),
    }
  }

  onSubmit() {
    const error = {};
    const dataMapping = this.mappingData(this.state.formData)
    Object.keys(dataMapping).forEach((key) => {
      if (!dataMapping[key]) {
        error[key] = 'Thông tin còn thiếu';
      }
    });
    if (!Object.keys(error).length) {
      this.props.createCollection(dataMapping);
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
              <BreadcrumbItem><Link to="/">Trang chủ</Link></BreadcrumbItem>
              <BreadcrumbItem><Link to="/collections">Bộ sưu tập</Link></BreadcrumbItem>
              <BreadcrumbItem active>Tạo mới</BreadcrumbItem>
            </Breadcrumb>
          </Col>
        </Row>
        <Container fluid>
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify"></i> Tạo mới bộ sưu tập
                </CardHeader>
                <CardBody>
                  <Alert color="danger" isOpen={!!this.props.message} toggle={() => this.props.clearMessage()}>
                    {this.props.message}
                  </Alert>
                  <Row>
                    <Col xs="6">
                      <FormGroup>
                        <Label htmlFor="name">Tên</Label>
                        <Input
                          type="text"
                          id="name"
                          name="name"
                          required
                          onChange={this.onChange}
                          value={this.state.formData.name}
                          className={this.state.error.name && 'is-invalid'}
                        />
                        <div className="invalid-feedback">{this.state.error.name}</div>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="6">
                      <FormGroup>
                        <Label htmlFor="name">Mô tả</Label>
                        <Input
                          type="textarea"
                          name="description"
                          id="description"
                          rows="4"
                          onChange={this.onChange}
                          value={this.state.formData.description}
                          className={this.state.error.description && 'is-invalid'}
                        />
                        <div className="invalid-feedback">{this.state.error.description}</div>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="3">
                      <FormGroup>
                        <Label htmlFor="collection-categories">Danh mục</Label>
                        <Input
                          onChange={this.onChangeMultiple}
                          type="select"
                          name="cateIds"
                          id="collection-categories"
                          multiple
                          className={this.state.error.cateIds && 'is-invalid'}
                          value={this.state.formData.cateIds}
                        >
                          {this.props.initData.categories.map((i) => (
                            <option key={i.id} value={i.id}>{i.name}</option>
                          ))}
                        </Input>
                        <div className="invalid-feedback">{this.state.error.cateIds}</div>
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
                          className={this.state.error.subjectIds && 'is-invalid'}
                          value={this.state.formData.subjectIds}
                        >
                          {this.props.initData.subjects.map((i) => (
                            <option key={i.id} value={i.id}>{i.name}</option>
                          ))}
                        </Input>
                        <div className="invalid-feedback">{this.state.error.subjectIds}</div>
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
                          className={this.state.error.classIds && 'is-invalid'}
                          value={this.state.formData.classIds}
                        >
                          {this.props.initData.classes.map((i) => (
                            <option key={i.id} value={i.id}>{i.name}</option>
                          ))}
                        </Input>
                        <div className="invalid-feedback">{this.state.error.classIds}</div>
                      </FormGroup>
                    </Col>
                    <Col xs="3">
                      <FormGroup>
                        <Label htmlFor="collection-school-year">Năm học</Label>
                        <Input
                          onChange={this.onChangeMultiple}
                          type="select"
                          name="yearSchools"
                          id="collection-school-year"
                          multiple
                          className={this.state.error.yearSchools && 'is-invalid'}
                          value={this.state.formData.yearSchools}
                        >
                          <option value={2010}>2010</option>
                          <option value={2011}>2011</option>
                          <option value={2012}>2012</option>
                          <option value={2013}>2013</option>
                          <option value={2014}>2014</option>
                          <option value={2015}>2015</option>
                          <option value={2016}>2016</option>
                          <option value={2017}>2017</option>
                          <option value={2018}>2018</option>
                        </Input>
                        <div className="invalid-feedback">{this.state.error.yearSchools}</div>
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <div className="float-right" style={{ marginLeft: '10px'}}>
                    <Button
                      block
                      color="primary"
                      size="sm"
                      onClick={this.onSubmit}
                    >Tạo</Button>
                  </div>
                  <div className="float-right">
                    <Button
                      block
                      color="danger"
                      size="sm"
                      onClick={this.resetForm}
                    >Nhập lại</Button>
                  </div>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

CollectionCreate.propTypes = {
  loading: PropTypes.bool,
};

export function mapDispatchToProps(dispatch) {
  return {
    createCollection: (data) => dispatch(createCollection(data)),
    clearMessage: () => dispatch(clearMessage()),
    getInitData: () => dispatch(getInitData()),
  };
}

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  message: makeSelectMessage(),
  initData: makeSelectInitData(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'collectionCreate', reducer });
const withSaga = injectSaga({ key: 'collectionCreate', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(CollectionCreate);
