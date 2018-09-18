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

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { getSubjects } from './actions';
import {
  makeSelectSubjects,
  makeSelectLoading,
} from './selectors';
import reducer from './reducer';
import saga from './saga';

const itemsPerLoad = 10;

/* eslint-disable react/prefer-stateless-function */
export class Subject extends React.PureComponent {
  constructor() {
    super();
    this.state = {};
  }

  componentWillMount() {
    // get subjects
    this.props.getSubjects();
  }

  renderSubjectRow(subjects) {
    return subjects.map((item) => (
      <tr key={item.id}>
          <th scope="row">{item.id}</th>
          <td>{item.name}</td>
          <td>{item.description}</td>
          <td>{item.userName}</td>
          <td>{moment(item.createdAt).format('DD/MM/YYYY')}</td>
      </tr>
    ))
  }

  render() {
    console.log(this.props.subjects)
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Breadcrumb>
              <BreadcrumbItem><Link to="/">Trang chủ</Link></BreadcrumbItem>
              <BreadcrumbItem active>Môn học</BreadcrumbItem>
            </Breadcrumb>
          </Col>
        </Row>
        <Container fluid>
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify"></i> Môn học
                  <div className="float-right">
                    <Button
                      block
                      color="primary"
                      size="sm"
                      onClick={() => this.props.history.push('/subjects/create')}
                    >Tạo mới</Button>
                  </div>
                </CardHeader>
                <CardBody>
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Tên</th>
                        <th scope="col">Mô tả</th>
                        <th scope="col">Người tạo</th>
                        <th scope="col">Ngày tạo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.renderSubjectRow(this.props.subjects)}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

Subject.propTypes = {
  loading: PropTypes.bool,
};

export function mapDispatchToProps(dispatch) {
  return {
    getSubjects: () => dispatch(getSubjects()),
  };
}

const mapStateToProps = createStructuredSelector({
  subjects: makeSelectSubjects(),
  loading: makeSelectLoading(),
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
