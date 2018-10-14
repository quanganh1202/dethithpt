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
import { getNews, deleteNews, clearProcessStatus } from './actions';
import { makeSelectNews, makeSelectLoading, makeSelectProcessStatus } from './selectors';
import reducer from './reducer';
import saga from './saga';

const Wrapper = styled.div`
  table {
    font-size: 11px;
  }
`;

const acceptedPosition = [
  'Nội quy',
];

/* eslint-disable react/prefer-stateless-function */
export class News extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedNews: [],
    };
    this.module = props.location.pathname.split('/')[2];
    this.renderNewsRow = this.renderNewsRow.bind(this);
    this.handleSelectNews = this.handleSelectNews.bind(this);
  }

  componentWillMount() {
    const query = {
      type: this.module,
    }
    // get news
    this.props.getNews(query);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.processStatus && !this.props.processStatus) {
      this.setState({
        selectedNews: [],
      });
      this.module = nextProps.location.pathname.split('/')[2];
      const query = {
        type: this.module,
      };
      // get news
      this.props.getNews(query);
      this.props.clearProcessStatus();
    }
    if (this.props.location.pathname !== nextProps.location.pathname) {
      this.module = nextProps.location.pathname.split('/')[2];
      const query = {
        type: this.module,
      };
      // get news
      this.props.getNews(query);
    }
  }

  componentWillUnmount() {
    this.props.clearProcessStatus(true);
  }

  renderNewsRow(news) {
    return news.map((item, idx) => (
      <tr key={item.id}>
        <th scope="row">{idx + 1}</th>
        <td>
          <input
            type="checkbox"
            name={`select-${item.id}`}
            value={item.id}
            onClick={this.handleSelectNews}
            checked={this.state.selectedNews.includes(item.id)}
          />
        </td>
        <td>
          <Link to={`/modules/${this.module}/${item.id}`}>{item.name}</Link>
        </td>
        <td>{item.userEmail}</td>
        {this.module === 'general' && <td>{acceptedPosition[item.position - 1]}</td>}
        <td>{moment(item.createdAt).format('DD/MM/YYYY')}</td>
      </tr>
    ));
  }

  handleSelectNews(e) {
    const { value, checked } = e.currentTarget;
    if (value === 'all') {
      this.setState({
        selectedNews: checked ? this.props.news.map((i) => i.id) : [],
      });
    } else {
      this.setState({
        selectedNews: checked
          ? [ ...this.state.selectedNews, value ]
          : this.state.selectedNews.filter((i) => i !== value),
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
              <BreadcrumbItem active>Tin tức</BreadcrumbItem>
            </Breadcrumb>
          </Col>
        </Row>
        <Container fluid>
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify" /> Tin tức
                  <div className="float-right" style={{ marginLeft: '10px' }}>
                    <Button
                      block
                      color="primary"
                      size="sm"
                      onClick={() =>
                        this.props.history.push(`/modules/${this.module}/create`)
                      }
                    >
                      Tạo mới
                    </Button>
                  </div>
                  <div className="float-right">
                    <Button
                      block
                      color="danger"
                      size="sm"
                      onClick={() => this.props.deleteNews((this.state.selectedNews))}
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
                            onChange={this.handleSelectNews}
                            checked={_.isEqual(this.state.selectedNews, this.props.news.map((i) => i.id))}
                          />
                        </th>
                        <th scope="col">Tên</th>
                        <th scope="col">Người tạo</th>
                        {this.module === 'general' && <th scope="col">Vị trí</th>}
                        <th scope="col">Ngày tạo</th>
                      </tr>
                    </thead>
                    <tbody>{this.renderNewsRow(this.props.news)}</tbody>
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

News.propTypes = {
  loading: PropTypes.bool,
};

export function mapDispatchToProps(dispatch) {
  return {
    getNews: (query) => dispatch(getNews(query)),
    deleteNews: (id) => dispatch(deleteNews(id)),
    clearProcessStatus: (all) => dispatch(clearProcessStatus(all)),
  };
}

const mapStateToProps = createStructuredSelector({
  news: makeSelectNews(),
  loading: makeSelectLoading(),
  processStatus: makeSelectProcessStatus(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'news', reducer });
const withSaga = injectSaga({ key: 'news', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(News);
