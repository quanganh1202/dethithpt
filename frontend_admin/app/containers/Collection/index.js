/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
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
  Col,
  Row,
  Table,
  Button,
} from 'reactstrap';
import moment from 'moment';
import styled from 'styled-components';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { getCollections, deleteCollections, clearProcessStatus } from './actions';
import { makeSelectCollections, makeSelectLoading, makeSelectProcessStatus } from './selectors';
import reducer from './reducer';
import saga from './saga';

const Wrapper = styled.div`
  table {
    font-size: 11px;
    tbody {
      tr > td {
        p {
          margin: 0;
        }
      }
    }
  }
`;

/* eslint-disable react/prefer-stateless-function */
export class Collection extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      selectedCollections: [],
    };
    this.handleSelectCollections = this.handleSelectCollections.bind(this);
  }

  componentWillMount() {
    // get collections
    this.props.getCollections();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.processStatus && !this.props.processStatus) {
      this.setState({
        selectedCollections: [],
      });
      this.props.getCollections();
      this.props.clearProcessStatus();
    }
  }

  renderCollectionRow(collections) {
    return collections.map((item, idx) => (
      <tr key={item.id}>
        <th scope="row">{idx + 1}</th>
        <td>
          <input
            type="checkbox"
            name={`select-${item.id}`}
            value={item.id}
            onClick={this.handleSelectCollections}
            checked={this.state.selectedCollections.includes(item.id)}
          />
        </td>
        <td>
          <Link to={`/collections/${item.id}`}>{item.name}</Link>
        </td>
        <td>{item.description}</td>
        <td>{(item.cates || []).map((i) => <p key={i.cateId}>{i.cateName}</p>)}</td>
        <td>{(item.subjects || []).map((i) => <p key={i.subjectId}>{i.subjectName}</p>)}</td>
        <td>{(item.classes || []).map((i) => <p key={i.classId}>{i.className}</p>)}</td>
        <td>{(item.yearSchools || '').split(',').map((i) => <p key={i}>{i}</p>)}</td>
        <td>{item.userEmail}</td>
        <td>{moment(item.createdAt).format('DD/MM/YYYY')}</td>
        <td>{item.view}</td>
        <td>{item.numDocRefs}</td>
        <td style={{ textAlign: 'center' }}>
          <button
            onClick={() => {}}
            title="Nổi bật trang chủ"
          >
            <i className={`fa ${item.priorityHome ? 'fa-check' : 'fa-close'} fa-lg`} aria-hidden="true"></i>
          </button>
        </td>
        <td style={{ textAlign: 'center' }}>
          <button
            onClick={() => {}}
            title="Nổi bật danh mục"
          >
            <i className={`fa ${item.priorityCate ? 'fa-check' : 'fa-close'} fa-lg`} aria-hidden="true"></i>
          </button>
        </td>
        <td></td>
      </tr>
    ));
  }

  handleSelectCollections(e) {
    const { value, checked } = e.currentTarget;
    if (value === 'all') {
      this.setState({
        selectedCollections: checked ? this.props.collections.map((i) => i.id) : [],
      });
    } else {
      this.setState({
        selectedCollections: checked
          ? [ ...this.state.selectedCollections, value ]
          : this.state.selectedCollections.filter((i) => i !== value),
      });
    }
  }

  render() {
    return (
      <Wrapper className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Breadcrumb>
              <BreadcrumbItem>
                <Link to="/">Trang chủ</Link>
              </BreadcrumbItem>
              <BreadcrumbItem active>Bộ sưu tập</BreadcrumbItem>
            </Breadcrumb>
          </Col>
        </Row>
        <Container fluid>
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify" /> Bộ sưu tập
                  <div className="float-right">
                    <Button
                      block
                      color="primary"
                      size="sm"
                      onClick={() =>
                        this.props.history.push('/collections/create')
                      }
                    >
                      Tạo mới
                    </Button>
                  </div>
                  <div className="float-right" style={{ marginLeft: '10px' }}>
                    <Button
                      block
                      color="warning"
                      size="sm"
                      onClick={() => {}}
                      style={{ color: 'white' }}
                    >Sắp xếp</Button>
                  </div>
                  <div className="float-right">
                    <Button
                      block
                      color="danger"
                      size="sm"
                      onClick={() => this.props.deleteCollections((this.state.selectedCollections))}
                    >Xoá</Button>
                  </div>
                </CardHeader>
                <CardBody>
                  <Table responsive hover striped>
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th>
                          <input
                            type="checkbox"
                            value="all"
                            name="select"
                            onChange={this.handleSelectCollections}
                            checked={_.isEqual(this.state.selectedCollections, this.props.collections.map((i) => i.id))}
                          />
                        </th>
                        <th scope="col">Tên</th>
                        <th scope="col">Mô tả</th>
                        <th scope="col">Danh mục</th>
                        <th scope="col">Môn</th>
                        <th scope="col">Lớp</th>
                        <th scope="col">Năm</th>
                        <th scope="col">Người tạo</th>
                        <th scope="col">Ngày tạo</th>
                        <th scope="col">Lượt xem</th>
                        <th scope="col">Tài liệu</th>
                        <th scope="col">Nổi bật trang chủ</th>
                        <th scope="col">Nổi bật danh mục</th>
                        <th scope="col">Vị trí</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.renderCollectionRow(this.props.collections)}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </Wrapper>
    );
  }
}

Collection.propTypes = {
  loading: PropTypes.bool,
};

export function mapDispatchToProps(dispatch) {
  return {
    getCollections: () => dispatch(getCollections()),
    deleteCollections: (id) => dispatch(deleteCollections(id)),
    clearProcessStatus: () => dispatch(clearProcessStatus()),
  };
}

const mapStateToProps = createStructuredSelector({
  collections: makeSelectCollections(),
  loading: makeSelectLoading(),
  processStatus: makeSelectProcessStatus(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'collection', reducer });
const withSaga = injectSaga({ key: 'collection', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(Collection);
