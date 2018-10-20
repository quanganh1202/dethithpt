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
import { createNews, clearMessage, getNews } from './actions';
import {
  makeSelectMessage,
  makeSelectLoading,
  makeSelectNews,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
import Wrapper from './Wrapper';

const dataInit = {
  name: '',
  text: '',
};

const acceptedPosition = [
  'Nội quy',
  'Thông báo trang chủ',
  'Nội quy cột phải',
  'Admin hỗ trợ',
];

/* eslint-disable react/prefer-stateless-function */
export class NewsCreate extends React.PureComponent {
  constructor(props) {
    super(props);
    this.module = props.history.location.pathname.split('/')[1] === 'news'
      ? 'news'
      : props.history.location.pathname.split('/')[2];
    this.state = {
      formData: {
        name: '',
        text: '',
        type: this.module,
        active: '1',
        position: 0,
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
    const query = {
      type: this.module,
    }
    // get news
    this.props.getNews(query);
  }

  componentWillUnmount() {
    this.props.clearMessage();
  }

  resetForm() {
    window.scrollTo(0, 0);
    this.setState({
      formData: {
        ...dataInit,
        type: this.module,
        active: 1,
      },
      error: {},
    });
    this.props.clearMessage();
  }

  onChange(e) {
    const { name, value } = e.currentTarget
    this.setState({ formData: { ...this.state.formData, [name]: value } })
  }

  onChangeEditor(evt) {
    const newContent = evt.editor.getData();
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
    if (this.module !== 'general') {
      delete error.position;
    }
    if (!Object.keys(error).length) {
      this.props.createNews({ ...this.state.formData, position: parseInt(this.state.formData.position) }, this.module);
    } else {
      this.setState({ error });
    }
  }

  clearMessage() {
    this.props.clearMessage();
  }

  render() {
    const existedPosition = this.props.news.map((i) => i.position);
    return (
      <Wrapper className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Breadcrumb>
              <BreadcrumbItem><Link to="/">Trang chủ</Link></BreadcrumbItem>
              <BreadcrumbItem>
                <Link to={`/${this.module === 'news' ? 'news' : `modules/${this.module}`}`}>Tin tức</Link>
              </BreadcrumbItem>
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
                          >
                            <option value="0">Chọn vị trí</option>
                            {acceptedPosition.map((i, idx) => {
                              if (!existedPosition.includes(idx + 1)) {
                                return <option key={idx} value={idx + 1}>{i}</option>;
                              }
                              return null;
                            })}
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
                          activeClass={`news-text ${this.state.error.text && 'is-invalid'}`}
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
                      onClick={() => {}}
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
    createNews: (data, module) => dispatch(createNews(data, module)),
    clearMessage: () => dispatch(clearMessage()),
    getNews: (query) => dispatch(getNews(query)),
  };
}

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  message: makeSelectMessage(),
  news: makeSelectNews(),
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
