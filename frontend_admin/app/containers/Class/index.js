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
import { getClasses, deleteClasses, clearProcessStatus, updateClasses } from './actions';
import { makeSelectClasses, makeSelectLoading, makeSelectProcessStatus } from './selectors';
import reducer from './reducer';
import saga from './saga';

const Wrapper = styled.div`
  table {
    font-size: 11px;
  }
`;

/* eslint-disable react/prefer-stateless-function */
export class Classes extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      selectedClasses: [],
      classes: [],
      changedClasses: [],
    };
    this.handleSelectClasses = this.handleSelectClasses.bind(this);
    this.handleSavePosition = this.handleSavePosition.bind(this);
    this.handleChangePosition = this.handleChangePosition.bind(this);
  }

  componentWillMount() {
    // get classes
    this.props.getClasses();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.processStatus && !this.props.processStatus) {
      this.setState({
        selectedClasses: [],
      });
      this.props.getClasses();
      this.props.clearProcessStatus();
    }
    console.log(nextProps.classes, this.props.classes)
    if (!_.isEqual(nextProps.classes, this.props.classes)) {
      this.setState({
        classes: nextProps.classes,
      });
    }
  }

  componentWillUnmount() {
    this.props.clearProcessStatus(true);
  }

  renderClassRow(classes) {
    return classes.map((item, idx) => (
      <tr key={item.id}>
        <th scope="row">{idx + 1}</th>
        <td>
          <input
            type="checkbox"
            name={`select-${item.id}`}
            value={item.id}
            onClick={this.handleSelectClasses}
            checked={this.state.selectedClasses.includes(item.id)}
          />
        </td>
        <td>
          <Link to={`/classes/${item.id}`}>{item.name}</Link>
        </td>
        <td>{item.description}</td>
        <td>{item.userEmail}</td>
        <td>{moment(item.createdAt).format('DD/MM/YYYY')}</td>
        <td>{item.view}</td>
        <td>{item.numDocRefs}</td>
        <td>
          <input
            style={{ border: '1px solid #ccc', maxWidth: '50px'}}
            type="number"
            name={`position-item-${item.id}-${idx}`}
            value={item.position}
            onChange={this.handleChangePosition}
          />
        </td>
      </tr>
    ));
  }

  handleSelectClasses(e) {
    const { value, checked } = e.currentTarget;
    if (value === 'all') {
      this.setState({
        selectedClasses: checked ? this.props.classes.map((i) => i.id) : [],
      });
    } else {
      this.setState({
        selectedClasses: checked
          ? [ ...this.state.selectedClasses, value ]
          : this.state.selectedClasses.filter((i) => i !== value),
      });
    }
  }

  handleSavePosition() {
    if (this.state.changedClasses.length) {
      const updatedClasses = this.state.classes
        .filter((item) => this.state.changedClasses.includes(item.id))
        .map((item) => ({ id: item.id, position: parseInt(item.position) }))
      this.props.updateClasses(updatedClasses);
    }
  }

  handleChangePosition(e) {
    const { name, value } = e.currentTarget;
    const field = name.split('-')[0];
    const item = name.split('-')[2];
    const index = name.split('-')[3];
    const classes = _.cloneDeep(this.state.classes);
    classes[index] = { ...this.state.classes[index], [field]: value };
    this.setState({
      classes,
      changedClasses: _.uniq([ ...this.state.changedClasses, item ]),
    })
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
              <BreadcrumbItem active>Lớp</BreadcrumbItem>
            </Breadcrumb>
          </Col>
        </Row>
        <Container fluid>
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify" /> Lớp
                  <div className="float-right" style={{ marginLeft: '10px' }}>
                    <Button
                      block
                      color="primary"
                      size="sm"
                      onClick={() => this.props.history.push('/classes/create')}
                    >
                      Tạo mới
                    </Button>
                  </div>
                  <div className="float-right" style={{ marginLeft: '10px' }}>
                    <Button
                      block
                      color="warning"
                      size="sm"
                      onClick={this.handleSavePosition}
                      style={{ color: 'white' }}
                    >Sắp xếp</Button>
                  </div>
                  <div className="float-right">
                    <Button
                      block
                      color="danger"
                      size="sm"
                      onClick={() => this.props.deleteClasses((this.state.selectedClasses))}
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
                            onChange={this.handleSelectClasses}
                            checked={_.isEqual(this.state.selectedClasses, this.props.classes.map((i) => i.id))}
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
                    <tbody>{this.renderClassRow(this.state.classes)}</tbody>
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

Classes.propTypes = {
  loading: PropTypes.bool,
};

export function mapDispatchToProps(dispatch) {
  return {
    getClasses: () => dispatch(getClasses()),
    deleteClasses: (id) => dispatch(deleteClasses(id)),
    clearProcessStatus: (all) => dispatch(clearProcessStatus(all)),
    updateClasses: (classes) => dispatch(updateClasses(classes)),
  };
}

const mapStateToProps = createStructuredSelector({
  classes: makeSelectClasses(),
  loading: makeSelectLoading(),
  processStatus: makeSelectProcessStatus(),
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
