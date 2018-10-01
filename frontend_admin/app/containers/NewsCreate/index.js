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
import CKEditor from 'components/CKEditor';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { createNews, clearMessage } from './actions';
import {
  makeSelectMessage,
  makeSelectLoading,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
import Wrapper from './Wrapper';

const dataInit = {
  name: '',
  text: '',
};

/* eslint-disable react/prefer-stateless-function */
export class NewsCreate extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      formData: {
        name: '',
        text: '',
      },
      error: {},
      content: '',
    };
    this.resetForm = this.resetForm.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeEditor = this.onChangeEditor.bind(this);
  }

  resetForm() {
    this.setState({ formData: dataInit, error: {} });
    this.props.clearMessage();
  }

  onChange(e) {
    const { name, value } = e.currentTarget
    this.setState({ formData: { ...this.state.formData, [name]: value } })
  }

  onChangeEditor(evt) {
    var newContent = evt.editor.getData();
    this.setState({
      formData: {
        ...this.state.formData,
        text: newContent,
      }
    })
  }

  onSubmit() {
    const error = {};
    Object.keys(this.state.formData).forEach((key) => {
      if (!this.state.formData[key]) {
        error[key] = 'Thông tin còn thiếu';
      }
    });
    if (!Object.keys(error).length) {
      this.props.createNews(this.state.formData);
    } else {
      this.setState({ error });
    }
  }

  clearMessage() {
    this.props.clearMessage();
  }

  render() {
    console.log(this.state.formData);
    return (
      <Wrapper className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Breadcrumb>
              <BreadcrumbItem><Link to="/">Trang chủ</Link></BreadcrumbItem>
              <BreadcrumbItem><Link to="/news">Tin tức</Link></BreadcrumbItem>
              <BreadcrumbItem active>Tạo mới</BreadcrumbItem>
            </Breadcrumb>
          </Col>
        </Row>
        <Container fluid>
          <Row>
            <Col xl={6}>
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify"></i> Tạo mới tin tức
                </CardHeader>
                <CardBody>
                  <Alert color="danger" isOpen={!!this.props.message} toggle={() => this.props.clearMessage()}>
                    {this.props.message}
                  </Alert>
                  <Row>
                    <Col xs="12">
                      <FormGroup>
                        <Label htmlFor="name">Tiêu đề</Label>
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
                    <Col xs="12">
                      <FormGroup>
                        <Label htmlFor="name">Chi tiết</Label>
                        <CKEditor
                          activeClass="news-text"
                          name="news"
                          content={this.state.formData.text} 
                          events={{
                            "change": this.onChangeEditor
                          }}
                        />
                        <div className="invalid-feedback">{this.state.error.text}</div>
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
      </Wrapper>
    );
  }
}

NewsCreate.propTypes = {
  loading: PropTypes.bool,
};

export function mapDispatchToProps(dispatch) {
  return {
    createNews: (data) => dispatch(createNews(data)),
    clearMessage: () => dispatch(clearMessage()),
  };
}

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  message: makeSelectMessage(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'newsCreate', reducer });
const withSaga = injectSaga({ key: 'newsCreate', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(NewsCreate);
