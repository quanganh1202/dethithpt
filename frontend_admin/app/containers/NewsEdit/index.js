/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { Fragment } from 'react';
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
import LoadingIndicator from 'components/LoadingIndicator';
import _ from 'lodash';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { updateNews, clearMessage, clearData, getNewsDetail } from './actions';
import {
  makeSelectMessage,
  makeSelectLoading,
  makeSelectNewsDetail,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
import Wrapper from './Wrapper';

const acceptedPosition = [
  'Nội quy',
  'Thông báo trang chủ',
  'Nội quy cột phải',
  'Admin hỗ trợ',
];

/* eslint-disable react/prefer-stateless-function */
export class NewsEdit extends React.PureComponent {
  constructor(props) {
    super(props);
    this.module = props.history.location.pathname.split('/')[1] === 'news'
      ? 'news'
      : props.history.location.pathname.split('/')[2];
    this.state = {
      originData: {
        name: '',
        text: '',
        active: '1',
      },
      formData: {
        name: '',
        text: '',
        active: '1',
      },
      error: {},
      content: '',
    };
    this.resetForm = this.resetForm.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeEditor = this.onChangeEditor.bind(this);
  }

  componentWillMount() {
    this.props.getNewsDetail(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if ((_.isEmpty(this.props.newsDetail) && !_.isEqual(this.props.newsDetail, nextProps.newsDetail))
    || !_.isEmpty(this.props.newsDetail)) {
      const newData = {
        ...this.state.formData,
        name: nextProps.newsDetail.name,
        text: nextProps.newsDetail.text,
        active: nextProps.newsDetail.active,
      };
      this.setState({
        formData: newData,
        originData: newData,
      });
    }
  }

  componentWillUnmount() {
    this.props.clearMessage();
    this.props.clearData();
  }

  resetForm() {
    window.scrollTo(0, 0);
    this.setState({
      formData: this.state.originData,
      error: {},
    });
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
      this.props.updateNews(this.props.match.params.id, this.state.formData, this.module);
    } else {
      this.setState({ error });
    }
  }

  clearMessage() {
    this.props.clearMessage();
  }

  render() {
    return (
      <Wrapper className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Breadcrumb>
              <BreadcrumbItem><Link to="/">Trang chủ</Link></BreadcrumbItem>
              <BreadcrumbItem>
                <Link to={`/${this.module === 'news' ? 'news' : `modules/${this.module}`}`}>Tin tức</Link>
              </BreadcrumbItem>
              <BreadcrumbItem active>Cập nhật</BreadcrumbItem>
            </Breadcrumb>
          </Col>
        </Row>
        <Container fluid>
          <Row>
            <Col xl={6}>
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify"></i> Cập nhật tin tức
                </CardHeader>
                <CardBody>
                  <Alert color="danger" isOpen={!!this.props.message} toggle={() => this.props.clearMessage()}>
                    {this.props.message}
                  </Alert>
                  {this.props.loading ? <LoadingIndicator /> : (
                    <Fragment>
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
                      {this.module === 'general' && (
                        <Row>
                          <Col xs="12">
                            <FormGroup>
                              <Label htmlFor="name">Vị trí</Label>
                              <Input
                                type="select"
                                id="position"
                                name="position"
                                required
                                onChange={this.onChange}
                                value={this.state.formData.position}
                                className={this.state.error.position && 'is-invalid'}
                                disabled
                              >
                                <option value="0">Chọn vị trí</option>
                                {acceptedPosition.map((i, idx) => <option key={idx} value={idx}>{i}</option>)}
                              </Input>
                              <div className="invalid-feedback">{this.state.error.position}</div>
                            </FormGroup>
                          </Col>
                        </Row>
                      )}
                      <Row>
                        <Col xs="12">
                          <FormGroup>
                            <Label htmlFor="name">{this.module === 'menu' ? 'Đường dẫn' : 'Chi tiết'}</Label>
                            {this.module === 'menu' ? (
                              <Input
                                type="text"
                                id="text"
                                name="text"
                                required
                                onChange={this.onChange}
                                value={this.state.formData.text}
                                className={this.state.error.text && 'is-invalid'}
                              />
                            ) : (<CKEditor
                              activeClass="news-text"
                              name="news"
                              content={this.state.formData.text} 
                              events={{
                                "change": this.onChangeEditor
                              }}
                            />)}
                            <div className="invalid-feedback">{this.state.error.text}</div>
                          </FormGroup>
                        </Col>
                      </Row>
                    </Fragment>
                  )}
                </CardBody>
                <CardFooter>
                  <div className="float-right" style={{ marginLeft: '10px'}}>
                    <Button
                      block
                      color="primary"
                      size="sm"
                      onClick={this.onSubmit}
                    >Lưu</Button>
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

NewsEdit.propTypes = {
  loading: PropTypes.bool,
};

export function mapDispatchToProps(dispatch) {
  return {
    updateNews: (id, data, module) => dispatch(updateNews(id, data, module)),
    clearMessage: () => dispatch(clearMessage()),
    clearData: () => dispatch(clearData()),
    getNewsDetail: (id) => dispatch(getNewsDetail(id)),
  };
}

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  message: makeSelectMessage(),
  newsDetail: makeSelectNewsDetail(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'newsEdit', reducer });
const withSaga = injectSaga({ key: 'newsEdit', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(NewsEdit);
