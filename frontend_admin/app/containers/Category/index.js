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
import { PaginationTable } from 'components/Table';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { getCategories, deleteCates, clearProcessStatus, updateCategories } from './actions';
import {
  makeSelectCategories,
  makeSelectLoading,
  makeSelectProcessStatus,
  makeSelectTotalCate,
} from './selectors';
import reducer from './reducer';
import saga from './saga';

const Wrapper = styled.div`
  table {
    font-size: 11px;
  }
`;

/* eslint-disable react/prefer-stateless-function */
export class Category extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      currentPage: 1,
      selectedCates: [],
      categories: [],
      changedCategories: [],
    };
    this.size = 10;
    this.maxPages = 11;
    this.handleSelectCate = this.handleSelectCate.bind(this);
    this.handleSavePosition = this.handleSavePosition.bind(this);
    this.handleChangePosition = this.handleChangePosition.bind(this);
    this.onSelectPage = this.onSelectPage.bind(this);
  }

  componentWillMount() {
    // get categories
    this.props.getCategories({
      sort: 'position.desc',
      offset: 0,
      size: this.size,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.processStatus && !this.props.processStatus) {
      this.setState({
        selectedCates: [],
        currentPage: 1,
      });
      this.props.getCategories({
        sort: 'position.desc',
        offset: 0,
        size: this.size,
      });
      this.props.clearProcessStatus();
    }
    if (!_.isEqual(nextProps.categories, this.props.categories)) {
      this.setState({
        categories: nextProps.categories,
      });
    }
  }

  componentWillUnmount() {
    this.props.clearProcessStatus(true);
  }

  onSelectPage(page) {
    if (this.state.currentPage !== page) {
      this.setState({
        currentPage: page,
      });
      this.props.getCategories({
        sort: 'position.desc',
        offset: this.size * (page - 1),
        size: this.size,
      });
    }
  }

  renderCategoryRow(categories) {
    return categories.map((cate, idx) => (
      <tr key={cate.id}>
        <th scope="row">{((this.state.currentPage - 1) * this.size) + idx + 1}</th>
        <td>
          <input
            type="checkbox"
            name={`select-${cate.id}`}
            value={cate.id}
            onClick={this.handleSelectCate}
            checked={this.state.selectedCates.includes(cate.id)}
          />
        </td>
        <td><Link to={`/categories/${cate.id}`}>{cate.name}</Link></td>
        <td>{cate.description}</td>
        <td>{cate.userEmail}</td>
        <td>{cate.numOfCollections}</td>
        <td>{cate.numDocRefs}</td>
        <td>{cate.view}</td>
        <td>
          <input
            style={{ border: '1px solid #ccc', maxWidth: '50px'}}
            type="number"
            name={`position-item-${cate.id}-${idx}`}
            value={cate.position}
            onChange={this.handleChangePosition}
          />
        </td>
        <td>{moment(cate.createdAt).format('DD/MM/YYYY')}</td>
      </tr>
    ));
  }

  handleSelectCate(e) {
    const { value, checked } = e.currentTarget;
    if (value === 'all') {
      this.setState({
        selectedCates: checked ? this.props.categories.map((i) => i.id) : [],
      });
    } else {
      this.setState({
        selectedCates: checked
          ? [ ...this.state.selectedCates, value ]
          : this.state.selectedCates.filter((i) => i !== value),
      });
    }
  }

  handleSavePosition() {
    if (this.state.changedCategories.length) {
      const updatedCates = this.state.categories
        .filter((item) => this.state.changedCategories.includes(item.id))
        .map((item) => ({ id: item.id, position: parseInt(item.position) }))
      this.props.updateCategories(updatedCates);
    }
  }

  handleChangePosition(e) {
    const { name, value } = e.currentTarget;
    const field = name.split('-')[0];
    const item = name.split('-')[2];
    const index = name.split('-')[3];
    const categories = _.cloneDeep(this.state.categories);
    categories[index] = { ...this.state.categories[index], [field]: value };
    this.setState({
      categories,
      changedCategories: _.uniq([ ...this.state.changedCategories, item ]),
    })
  }

  render() {
    return (
      <Wrapper className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Breadcrumb>
              <BreadcrumbItem><Link to="/">Trang chủ</Link></BreadcrumbItem>
              <BreadcrumbItem active>Danh mục</BreadcrumbItem>
            </Breadcrumb>
          </Col>
        </Row>
        <Container fluid>
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify"></i> Danh mục
                  <div className="float-right" style={{ marginLeft: '10px' }}>
                    <Button
                      block
                      color="primary"
                      size="sm"
                      onClick={() => this.props.history.push('/categories/create')}
                    >Tạo mới</Button>
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
                      onClick={() => this.props.deleteCates((this.state.selectedCates))}
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
                            onChange={this.handleSelectCate}
                            checked={_.isEqual(this.state.selectedCates, this.props.categories.map((i) => i.id))}
                          />
                        </th>
                        <th scope="col">Tên</th>
                        <th scope="col">Mô tả</th>
                        <th scope="col">Người tạo</th>
                        <th scope="col">Số bộ sưu tập</th>
                        <th scope="col">Số tài liệu</th>
                        <th scope="col">Lượt xem</th>
                        <th scope="col">Vị trí</th>
                        <th scope="col">Ngày tạo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.props.loading
                        ? (<tr><td colSpan="10" style={{ textAlign: 'center' }}>Loading...</td></tr>)
                        : this.renderCategoryRow(this.state.categories)}
                    </tbody>
                  </Table>
                  <PaginationTable
                    maxPages={this.maxPages}
                    total={this.props.total}
                    currentPage={this.state.currentPage}
                    size={this.size}
                    onClick={this.onSelectPage}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </Wrapper>
    );
  }
}

Category.propTypes = {
  loading: PropTypes.bool,
};

export function mapDispatchToProps(dispatch) {
  return {
    getCategories: (queries) => dispatch(getCategories(queries)),
    deleteCates: (id) => dispatch(deleteCates(id)),
    clearProcessStatus: (all) => dispatch(clearProcessStatus(all)),
    updateCategories: (cates) => dispatch(updateCategories(cates)),
  };
}

const mapStateToProps = createStructuredSelector({
  categories: makeSelectCategories(),
  total: makeSelectTotalCate(),
  loading: makeSelectLoading(),
  processStatus: makeSelectProcessStatus(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'category', reducer });
const withSaga = injectSaga({ key: 'category', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(Category);
