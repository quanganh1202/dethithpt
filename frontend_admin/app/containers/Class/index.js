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
import { getClasses } from './actions';
import {
  makeSelectClasses,
  makeSelectLoading,
} from './selectors';
import reducer from './reducer';
import saga from './saga';

const itemsPerLoad = 10;

/* eslint-disable react/prefer-stateless-function */
export class Classes extends React.PureComponent {
  constructor() {
    super();
    this.state = {};
  }

  componentWillMount() {
    // get classes
    this.props.getClasses();
  }

  renderClassRow(classes) {
    return classes.map((item) => (
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
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Breadcrumb>
              <BreadcrumbItem><Link to="/">Trang chủ</Link></BreadcrumbItem>
              <BreadcrumbItem active>Lớp</BreadcrumbItem>
            </Breadcrumb>
          </Col>
        </Row>
        <Container fluid>
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify"></i> Lớp
                  <div className="float-right">
                    <Button
                      block
                      color="primary"
                      size="sm"
                      onClick={() => this.props.history.push('/classes/create')}
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
                      {this.renderClassRow(this.props.classes)}
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

Classes.propTypes = {
  loading: PropTypes.bool,
};

export function mapDispatchToProps(dispatch) {
  return {
    getClasses: () => dispatch(getClasses()),
  };
}

const mapStateToProps = createStructuredSelector({
  classes: makeSelectClasses(),
  loading: makeSelectLoading(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'class', reducer });
const withSaga = injectSaga({ key: 'class', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(Classes);
