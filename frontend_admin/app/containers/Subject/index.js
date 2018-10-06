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
  Col,
  Row,
  Table,
  Button,
} from 'reactstrap';
import moment from 'moment';
import styled from 'styled-components';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { getSubjects, deleteSubjects, clearProcessStatus } from './actions';
import { makeSelectSubjects, makeSelectLoading, makeSelectProcessStatus } from './selectors';
import reducer from './reducer';
import saga from './saga';

const Wrapper = styled.div`
  table {
    font-size: 11px;
  }
`;

/* eslint-disable react/prefer-stateless-function */
export class Subject extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      selectedSubjects: [],
    };
    this.handleSelectSubject = this.handleSelectSubject.bind(this);
  }

  componentWillMount() {
    // get subjects
    this.props.getSubjects();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.processStatus && !this.props.processStatus) {
      this.setState({
        selectedSubjects: [],
      });
      this.props.getSubjects();
      this.props.clearProcessStatus();
    }
  }

  renderSubjectRow(subjects) {
    return subjects.map((item, idx) => (
      <tr key={item.id}>
        <th scope="row">{idx + 1}</th>
        <td>
          <input
            type="checkbox"
            name={`select-${item.id}`}
            value={item.id}
            onClick={this.handleSelectSubject}
            checked={this.state.selectedSubjects.includes(item.id)}
          />
        </td>
        <td>
          <Link to={`/subjects/${item.id}`}>{item.name}</Link>
        </td>
        <td>{item.description}</td>
        <td>{item.userEmail}</td>
        <td>{moment(item.createdAt).format('DD/MM/YYYY')}</td>
        <td>{item.view}</td>
        <td>{}</td>
        <td>{}</td>
      </tr>
    ));
  }

  handleSelectSubject(e) {
    const { value, checked } = e.currentTarget;
    if (value === 'all') {
      this.setState({
        selectedSubjects: checked ? this.props.subjects.map((i) => i.id) : [],
      });
    } else {
      this.setState({
        selectedSubjects: checked
          ? [ ...this.state.selectedSubjects, value ]
          : this.state.selectedSubjects.filter((i) => i !== value),
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
              <BreadcrumbItem active>Môn học</BreadcrumbItem>
            </Breadcrumb>
          </Col>
        </Row>
        <Container fluid>
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify" /> Môn học
                  <div className="float-right" style={{ marginLeft: '10px' }}>
                    <Button
                      block
                      color="primary"
                      size="sm"
                      onClick={() =>
                        this.props.history.push('/subjects/create')
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
                      onClick={() => this.props.deleteSubjects((this.state.selectedSubjects))}
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
                            onChange={this.handleSelectSubject}
                            checked={_.isEqual(this.state.selectedSubjects, this.props.subjects.map((i) => i.id))}
                          />
                        </th>
                        <th scope="col">Tên</th>
                        <th scope="col">Mô tả</th>
                        <th scope="col">Người tạo</th>
                        <th scope="col">Ngày tạo</th>
                        <th scope="col">Lượt xem</th>
                        <th scope="col">Tài liệu</th>
                        <th scope="col">Vị trí</th>
                      </tr>
                    </thead>
                    <tbody>{this.renderSubjectRow(this.props.subjects)}</tbody>
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

Subject.propTypes = {
  loading: PropTypes.bool,
};

export function mapDispatchToProps(dispatch) {
  return {
    getSubjects: () => dispatch(getSubjects()),
    deleteSubjects: (id) => dispatch(deleteSubjects(id)),
    clearProcessStatus: () => dispatch(clearProcessStatus()),
  };
}

const mapStateToProps = createStructuredSelector({
  subjects: makeSelectSubjects(),
  loading: makeSelectLoading(),
  processStatus: makeSelectProcessStatus(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'subject', reducer });
const withSaga = injectSaga({ key: 'subject', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(Subject);
