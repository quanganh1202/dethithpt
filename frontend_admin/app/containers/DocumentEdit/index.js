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
import _ from 'lodash';
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
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
} from 'reactstrap';
import Select, { Creatable } from 'react-select';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCog,
  faFolder,
  faCloudDownloadAlt,
  faCaretDown,
} from '@fortawesome/free-solid-svg-icons';
import TagsInput from 'react-tagsinput';
import { faMoneyBillAlt } from '@fortawesome/free-regular-svg-icons';
import Autosuggest from 'react-autosuggest';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { getDocDetail, clearMessage, clearData, editDoc, getDataInit } from './actions';
import {
  makeSelectMessage,
  makeSelectLoading,
  makeSelectDocDetail,
  makeSelectDataInit,
  makeSelectError,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
import Wrapper from './Wrapper';

library.add(faMoneyBillAlt, faFolder, faCog, faCloudDownloadAlt, faCaretDown);

/* eslint-disable react/prefer-stateless-function */
export class DocumentEdit extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      originData: {},
      formData: {},
      error: {},
    };
    this.resetForm = this.resetForm.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleMultiSelect = this.handleMultiSelect.bind(this);
    this.handleChangeTag = this.handleChangeTag.bind(this);
    this.autocompleteRenderInput = this.autocompleteRenderInput.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  componentWillMount() {
    this.props.getDocDetail(this.props.match.params.id);
    if (!this.props.location.search.split('=')[1]) {
      this.props.getDataInit();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.document, this.props.document)) {
      const updateNote = this.props.location.search.split('=')[1];
      const formData = updateNote
        ? { description: _.get(nextProps.document, 'description', '') }
        : this.mappingDataToForm(nextProps.document);
      this.setState({
        originData: formData,
        formData,
      });
    }
  }

  componentWillUnmount() {
    this.props.clearMessage();
    this.props.clearData();
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
    this.props.location.search.split('=')[1]
      ? this.props.editDoc(this.state.formData, this.props.match.params.id)
      : this.props.editDoc(this.mappingFormToSave(this.state.formData), this.props.match.params.id);
    // const error = {};
    // Object.keys(this.state.formData).forEach((key) => {
    //   if (!this.state.formData[key]) {
    //     error[key] = 'Thông tin còn thiếu';
    //   }
    // });
    // if (!Object.keys(error).length) {
    //   this.props.createSubject(this.state.formData);
    // } else {
    //   this.setState({ error });
    // }
  }

  clearMessage() {
    this.props.clearMessage();
  }

  handleMultiSelect(name, value) {
    this.setState({
      formData: {
        ...this.state.formData,
        [name]: value,
      }
    })
  }

  handleChangeTag(tags) {
    this.setState({
      formData: {
        ...this.state.formData,
        tags,
      }
    })
  }

  mappingDataToForm(data) {
    const mapped = {
      ...data,
      cates: _.get(data, 'cates', []).map((i) => ({ value: `${i.cateId}`, label: i.cateName })),
      subjects: _.get(data, 'subjects', []).map((i) => ({ value: `${i.subjectId}`, label: i.subjectName })),
      classes: _.get(data, 'classes', []).map((i) => ({ value: `${i.classId}`, label: i.className })),
      collections: _.get(data, 'collections', []).map((i) => ({ value: `${i.collectionId}`, label: i.collectionName })),
      yearSchools: _.get(data, 'yearSchools', []).map((i) => ({ value: i, label: i })),
    }
    return mapped;
  }

  mappingFormToSave(data) {
    const mapped = {
      description: data.description,
      name: data.name,
      price: data.price,
      fileUpload: data.fileUpload,
    }
    if (_.get(data, 'cates', []).length) mapped.cateIds = data.cates.map((i) => i.value).join(',');
    if (_.get(data, 'classes', []).length) mapped.classIds = data.classes.map((i) => i.value).join(',');
    if (_.get(data, 'collections', []).length) mapped.collectionIds = data.collections.map((i) => i.value).join(',');
    if (_.get(data, 'subjects', []).length) mapped.subjectIds = data.subjects.map((i) => i.value).join(',');
    if (_.get(data, 'tags', []).length) mapped.tags = data.tags.join(',');
    if (_.get(data, 'yearSchools', []).length) mapped.yearSchools = data.yearSchools.map((i) => i.value).join(',');
    return mapped;
  }

  autocompleteRenderInput({ addTag, ...props }) {
    const dataSuggestions = this.props.dataInit.tags.map(tag => ({
      name: tag.tag,
      value: tag.tag,
    }));

    const handleOnChange = (e, { method }) => {
      if (method === 'enter') {
        e.preventDefault();
      } else {
        props.onChange(e);
      }
    };

    const inputValue =
      (props.value && props.value.trim().toLowerCase()) || '';
    const inputLength = inputValue.length;

    const suggestions = dataSuggestions.filter(
      state => state.name.toLowerCase().slice(0, inputLength) === inputValue,
    );

    return (
      <Autosuggest
        ref={props.ref}
        suggestions={suggestions}
        shouldRenderSuggestions={value => value && value.trim().length > 0}
        getSuggestionValue={suggestion => suggestion.name}
        renderSuggestion={suggestion => <span>{suggestion.name}</span>}
        inputProps={{
          ...props,
          onChange: handleOnChange,
          placeholder: 'Enter để thêm',
        }}
        onSuggestionSelected={(e, { suggestion }) => {
          addTag(suggestion.name);
        }}
        onSuggestionsClearRequested={() => {}}
        onSuggestionsFetchRequested={() => {}}
      />
    );
  }

  handleUpload(e) {
    this.setState({
      formData: {
        ...this.state.formData,
        fileUpload: e.target.files[0],
      }
    })
  }

  render() {
    const updateNote = this.props.location.search.split('=')[1];
    const message = this.props.message || this.props.error || '';
    const AlertComponent = (
      <Alert
        color={this.props.message ? "info" : "danger"}
        isOpen={message}
        toggle={() => this.props.clearMessage()}
      >
        {message}
      </Alert>
    );
    return (
      <Wrapper className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Breadcrumb>
              <BreadcrumbItem><Link to="/">Trang chủ</Link></BreadcrumbItem>
              <BreadcrumbItem><Link to="/documents">Tài liệu</Link></BreadcrumbItem>
              <BreadcrumbItem active>Sửa tài liệu</BreadcrumbItem>
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
                          Ghi chú:
                          </Label>
                          <Col sm={9}>
                            <Input
                              sm={10}
                              rows={6}
                              type="textarea"
                              id="note"
                              name="description"
                              onChange={this.onChange}
                              value={this.state.formData.description || ''}
                              className={
                                this.state.error.description && 'is-invalid'
                              }
                            />
                            <div className="invalid-feedback">
                              {this.state.error.description}
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
            <Row>
              <Col xl={6}>
                <Card>
                  <CardHeader>
                    <i className="fa fa-align-justify"></i> Sửa tài liệu
                  </CardHeader>
                  <CardBody>
                    {AlertComponent}
                    {!_.isEmpty(this.props.document) ?
                      <Form className="form-horizontal form-edit-document">
                        <FormGroup row>
                          <Col md="3">
                          </Col>
                          <Col xs="12" md="9">
                            <Input type="file" id="file" name="file" onChange={this.handleUpload} />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col md="3">
                            <Label htmlFor="name">Tên tài liệu<span className="red">(*)</span></Label>
                          </Col>
                          <Col xs="12" md="9">
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
                          </Col>
                          <Col md="3">
                          </Col>
                          <Col xs="12" md="9">
                            <Select
                              name="cates"
                              className="rct-select-input"
                              options={this.props.dataInit.categories.map(sj => ({ value: sj.id, label: sj.name }))}
                              value={this.state.formData.cates}
                              onChange={(value) => this.handleMultiSelect('cates', value)}
                              isMulti
                              hideSelectedOptions={false}
                              closeMenuOnSelect={false}
                              placeholder="-- Chọn danh mục --"
                              isSearchable={false}
                              components={{
                                DropdownIndicator: () => (
                                  <FontAwesomeIcon
                                    style={{ margin: '0 5px' }}
                                    className="title-icon"
                                    icon={['fas', 'caret-down']}
                                  />
                                ),
                              }}
                            />
                          </Col>
                          <Col md="3">
                          </Col>
                          <Col xs="12" md="9">
                            <Select
                              name="subjects"
                              className="rct-select-input"
                              options={this.props.dataInit.subjects.map(sj => ({ value: sj.id, label: sj.name }))}
                              value={this.state.formData.subjects}
                              onChange={(value) => this.handleMultiSelect('subjects', value)}
                              isMulti
                              hideSelectedOptions={false}
                              closeMenuOnSelect={false}
                              placeholder="-- Chọn môn --"
                              isSearchable={false}
                              components={{
                                DropdownIndicator: () => (
                                  <FontAwesomeIcon
                                    style={{ margin: '0 5px' }}
                                    className="title-icon"
                                    icon={['fas', 'caret-down']}
                                  />
                                ),
                              }}
                            />
                          </Col>
                          <Col md="3">
                          </Col>
                          <Col xs="12" md="9">
                            <Select
                              name="classes"
                              className="rct-select-input"
                              options={this.props.dataInit.classes.map(sj => ({ value: sj.id, label: sj.name }))}
                              value={this.state.formData.classes}
                              onChange={(value) => this.handleMultiSelect('classes', value)}
                              isMulti
                              hideSelectedOptions={false}
                              closeMenuOnSelect={false}
                              placeholder="-- Chọn lớp --"
                              isSearchable={false}
                              components={{
                                DropdownIndicator: () => (
                                  <FontAwesomeIcon
                                    style={{ margin: '0 5px' }}
                                    className="title-icon"
                                    icon={['fas', 'caret-down']}
                                  />
                                ),
                              }}
                            />
                          </Col>
                          <Col md="3">
                          </Col>
                          <Col xs="12" md="9">
                            <Select
                              name="cates"
                              className="rct-select-input"
                              options={Array(41)
                                .fill((new Date()).getFullYear() - 20)
                                .map((y, idx) => ({ value: y + idx, label: y + idx }))}
                              value={this.state.formData.yearSchools}
                              onChange={(value) => this.handleMultiSelect('yearSchools', value)}
                              isMulti
                              hideSelectedOptions={false}
                              closeMenuOnSelect={false}
                              placeholder="-- Chọn năm học --"
                              isSearchable={false}
                              components={{
                                DropdownIndicator: () => (
                                  <FontAwesomeIcon
                                    style={{ margin: '0 5px' }}
                                    className="title-icon"
                                    icon={['fas', 'caret-down']}
                                  />
                                ),
                              }}
                            />
                          </Col>
                          <Col md="3">
                          </Col>
                          <Col xs="12" md="9">
                            <Select
                              name="collections"
                              className="rct-select-input"
                              options={this.props.dataInit.collections.map(sj => ({ value: sj.id, label: sj.name }))}
                              value={this.state.formData.collections}
                              onChange={(value) => this.handleMultiSelect('collections', value)}
                              isMulti
                              hideSelectedOptions={false}
                              closeMenuOnSelect={false}
                              placeholder="-- Chọn bộ sưu tập --"
                              isSearchable={false}
                              components={{
                                DropdownIndicator: () => (
                                  <FontAwesomeIcon
                                    style={{ margin: '0 5px' }}
                                    className="title-icon"
                                    icon={['fas', 'caret-down']}
                                  />
                                ),
                              }}
                            />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col md="3">
                            <Label htmlFor="name">Từ khóa<span className="red">(*)</span></Label>
                          </Col>
                          <Col xs="12" md="9">
                            <TagsInput
                              className="form-tags"
                              value={this.state.formData.tags || []}
                              onChange={this.handleChangeTag}
                              renderInput={this.autocompleteRenderInput}
                            />
                            {/* <div className="invalid-feedback">{this.state.error.description}</div> */}
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col md="3">
                            <Label htmlFor="name">Mô tả</Label>
                          </Col>
                          <Col xs="12" md="9">
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
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col md="3">
                            <Label htmlFor="price">Giá bán</Label>
                          </Col>
                          <Col xs="12" md="9">
                            <Input
                              type="text"
                              name="price"
                              id="price"
                              rows="4"
                              onChange={this.onChange}
                              value={this.state.formData.price}
                              // className={this.state.error.description && 'is-invalid'}
                            />
                            {/* <div className="invalid-feedback">{this.state.error.description}</div> */}
                          </Col>
                        </FormGroup>
                      </Form> : null
                    }

                  </CardBody>
                  <CardFooter>
                    <div className="float-left">
                      <Button
                        block
                        color="primary"
                        size="md"
                        onClick={this.onSubmit}
                      >Lưu</Button>
                    </div>
                    {/* <div className="float-right">
                      <Button
                        block
                        color="danger"
                        size="sm"
                        onClick={this.resetForm}
                      >Nhập lại</Button>
                    </div> */}
                  </CardFooter>
                </Card>
              </Col>
            </Row>
          </Container>)}
      </Wrapper>
    );
  }
}

DocumentEdit.propTypes = {
  loading: PropTypes.bool,
};

export function mapDispatchToProps(dispatch) {
  return {
    getDocDetail: (id) => dispatch(getDocDetail(id)),
    editDoc: (data, id) => dispatch(editDoc(data, id)),
    clearMessage: () => dispatch(clearMessage()),
    clearData: () => dispatch(clearData()),
    getDataInit: () => dispatch(getDataInit()),
  };
}

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  message: makeSelectMessage(),
  document: makeSelectDocDetail(),
  dataInit: makeSelectDataInit(),
  error: makeSelectError(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'documentEdit', reducer });
const withSaga = injectSaga({ key: 'documentEdit', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(DocumentEdit);
