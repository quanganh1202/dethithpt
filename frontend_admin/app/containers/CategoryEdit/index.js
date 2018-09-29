/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { isEqual } from 'lodash';
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
import {
  clearMessage,
  clearData,
  getCategoryDetail,
  updateCategory,
} from './actions';
import {
  makeSelectMessage,
  makeSelectLoading,
  makeSelectData,
} from './selectors';
import reducer from './reducer';
import saga from './saga';

/* eslint-disable react/prefer-stateless-function */
export class CategoryCreate extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      formData: {
        name: '',
        description: '',
      },
      originData: {
        name: '',
        description: '',
      },
      error: {},
    };
    this.resetForm = this.resetForm.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    this.props.getCategoryDetail(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.data, nextProps.data) && !nextProps.loading) {
      const originData = this.formatFromData(nextProps.data);
      this.setState({
        originData,
        formData: originData,
      });
    }
  }

  componentWillUnmount() {
    this.props.clearData();
  }

  formatFromData(data) {
    return {
      name: data.name,
      description: data.description,
    };
  }

  resetForm() {
    this.setState({ formData: this.state.originData, error: {} });
    this.props.clearMessage();
  }

  onChange(e) {
    const { name, value } = e.currentTarget;
    this.setState({ formData: { ...this.state.formData, [name]: value } });
  }

  onSubmit() {
    const error = {};
    Object.keys(this.state.formData).forEach(key => {
      if (!this.state.formData[key]) {
        error[key] = 'Thông tin còn thiếu';
      }
    });
    if (!Object.keys(error).length) {
      this.props.updateCategory(this.state.formData, this.props.match.params.id);
    } else {
      this.setState({ error });
    }
  }

  clearMessage() {
    this.props.clearMessage();
  }

  render() {
    return this.props.data.name ? (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Breadcrumb>
              <BreadcrumbItem>
                <Link to="/">Trang chủ</Link>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <Link to="/categories">Danh mục</Link>
              </BreadcrumbItem>
              <BreadcrumbItem active>Xem chi tiết</BreadcrumbItem>
            </Breadcrumb>
          </Col>
        </Row>
        <Container fluid>
          <Row>
            <Col xl={6}>
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify" /> Xem chi tiết danh mục
                </CardHeader>
                <CardBody>
                  <Alert
                    color="danger"
                    isOpen={this.props.message}
                    toggle={() => this.props.clearMessage()}
                  >
                    {this.props.message}
                  </Alert>
                  <Row>
                    <Col xs="12">
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
                        <div className="invalid-feedback">
                          {this.state.error.name}
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="12">
                      <FormGroup>
                        <Label htmlFor="name">Mô tả</Label>
                        <Input
                          type="textarea"
                          name="description"
                          id="description"
                          rows="4"
                          onChange={this.onChange}
                          value={this.state.formData.description}
                          className={
                            this.state.error.description && 'is-invalid'
                          }
                        />
                        <div className="invalid-feedback">
                          {this.state.error.description}
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <div className="float-right" style={{ marginLeft: '10px' }}>
                    <Button
                      block
                      color="primary"
                      size="sm"
                      onClick={this.onSubmit}
                    >
                      Sửa
                    </Button>
                  </div>
                  <div className="float-right">
                    <Button
                      block
                      color="danger"
                      size="sm"
                      onClick={this.resetForm}
                    >
                      Nhập lại
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    ) : null;
  }
}

CategoryCreate.propTypes = {
  loading: PropTypes.bool,
};

export function mapDispatchToProps(dispatch) {
  return {
    updateCategory: (data, id) => dispatch(updateCategory(data, id)),
    getCategoryDetail: id => dispatch(getCategoryDetail(id)),
    clearMessage: () => dispatch(clearMessage()),
    clearData: () => dispatch(clearData()),
  };
}

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  message: makeSelectMessage(),
  data: makeSelectData(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'categoryEdit', reducer });
const withSaga = injectSaga({ key: 'categoryEdit', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(CategoryCreate);
