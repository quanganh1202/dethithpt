/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { withRouter, Redirect } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCog,
  faFolder,
  faCloudDownloadAlt,
  faCaretDown,
} from '@fortawesome/free-solid-svg-icons';
import { faMoneyBillAlt } from '@fortawesome/free-regular-svg-icons';;
import Select from 'react-select';
import FileSaver from 'file-saver';
import queryString from 'query-string';
import _ from 'lodash';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import Tab from 'components/Tab';
import List from 'components/List';
import ListItem from 'components/ListItem';
import LoadingIndicator from 'components/LoadingIndicator';
import { getFilterData, getDocumentsList } from './actions';
import {
  requestDownload,
  removeFileSave,
  removeMessage,
  updateQuery,
  previewDoc,
  getPreview,
} from 'containers/HomePage/actions';
import {
  makeSelectDocument,
  makeSelectLoading,
  makeSelectDocuments,
  makeSelectFilterData,
} from './selectors';
import { makeSelectFile, makeSelectMessage, makeSelectCategories } from 'containers/HomePage/selectors'
import reducer from './reducer';
import saga from './saga';
import GreyTitle from 'containers/HomePage/GreyTitle';
import Wrapper from './Wrapper';

library.add(faMoneyBillAlt, faFolder, faCog, faCloudDownloadAlt, faCaretDown);

const itemsPerLoad = 10;

const errorMapping = {
  unknown_error_download: 'Tài liệu không còn tồn tại hoặc có lỗi, vui lòng báo lại cho admin!',
  not_enough_money: 'Tài khoản không còn đủ tiền để thanh toán, vui lòng nạp thêm!',
}
const acceptedQueryKeys = ['sort', 'subjectId', 'classId', 'yearSchools'];
const years = Array(21)
  .fill((new Date()).getFullYear() - 10)
  .map((y, idx) => `${y + idx}`);
const sortOptions = [
  { value: 'desc', label: 'Mới đăng' },
  { value: 'asc', label: 'Cũ đến mới' },
];

/* eslint-disable react/prefer-stateless-function */
export class Category extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      filter: {
        subject: '',
        class: '',
        year: '',
        sort: { value: 'desc', label: 'Mới đăng' },
      },
      resetKey: Math.random(),
      downloadingFile: '',
    };
    this.loadMoreDocs = this.loadMoreDocs.bind(this);
    this.handleChangeFilter = this.handleChangeFilter.bind(this);
  }

  componentWillMount() {
    window.scrollTo(0, 0);
    // get filter data
    this.props.getFilterData();
    const currentQueries = queryString.parse(this.props.location.search);
    const mappedQueries = {};
    Object.keys(currentQueries).forEach((k) => {
      if (acceptedQueryKeys.includes(k)) {
        mappedQueries[k] = currentQueries[k];
      }
    });
    const queries = {
      ...mappedQueries,
      sort: 'createdAt.desc',
      size: itemsPerLoad,
    };
    if (this.props.match.params.id) {
      queries.cateId = this.props.match.params.id;
      // Update filter for Collections
      this.props.updateQuery({
        cateId: this.props.match.params.id,
      });
    }
    this.props.getDocumentsList(queries, true);
  }

  componentWillReceiveProps(nextProps) {
    // handle switch between categories
    if (this.props.match.params.id !== nextProps.match.params.id) {
      window.scrollTo(0, 0);
      const queries = {
        sort: 'createdAt.desc',
        size: itemsPerLoad,
        cateId: nextProps.match.params.id,
      };
      this.props.getDocumentsList(queries, true);
      this.setState({
        resetKey: Math.random(),
      });

      // Update filter for Collections
      this.props.updateQuery({
        cateId: nextProps.match.params.id,
      });
    }

    // handle download success
    if (!this.props.file && nextProps.file) {
      const blob = new Blob([nextProps.file]);
      FileSaver.saveAs(blob, _.get(this.state, 'downloadingFile', 'download'));
      this.setState({ downloadingFile: '' });
      this.props.removeFileSave();
    }

    // handle error
    if (!this.props.message && nextProps.message) {
      this.setState({ downloadingFile: '' });
      alert(errorMapping[nextProps.message] || 'Có lỗi xảy ra, vui lòng báo lại cho admin!');
      this.props.removeMessage();
    }

    // handle change filter
    if (this.props.location.search !== nextProps.location.search) {
      const queries = queryString.parse(nextProps.location.search);
      const mappedQueries = {};
      Object.keys(queries).forEach((k) => {
        if (acceptedQueryKeys.includes(k)) {
          mappedQueries[k] = queries[k];
        }
      });
      mappedQueries.cateId = nextProps.match.params.id;
      mappedQueries.offset = 0;
      mappedQueries.size = itemsPerLoad;
      this.props.getDocumentsList(mappedQueries, true);
      if (!nextProps.location.search) {
        this.setState({
          resetKey: Math.random(),
        });
      }
    }
  }

  componentDidUpdate(prevProps) {
    const currentFilter = {
      search: this.props.location.search,
      cateId: this.props.match.params.id,
    };
    const prevFilter = {
      search: prevProps.location.search,
      cateId: prevProps.match.params.id,
    };

    if (!_.isEqual(currentFilter, prevFilter)) {
      const queryCollection = {
        cateId: currentFilter.cateId,
      };
      const currentQueries = queryString.parse(this.props.location.search);
      Object.keys(currentQueries).forEach((k) => {
        if (acceptedQueryKeys.includes(k) && k !== 'sort') {
          queryCollection[k] = currentQueries[k];
        }
      });

      this.props.updateQuery(queryCollection);
    }
  }

  mappingQueriesToFilter(search = '') {
    const filter = {};
    const queries = queryString.parse(search);
    Object.keys(queries).forEach((k) => {
      if (acceptedQueryKeys.includes(k)) {
        filter[k] = queries[k];
      }
    });
    if (filter.subjectId) {
      const subjectFilter = [];
      filter.subjectId.split(',').forEach((i) => {
        const subjectDetail = this.props.filterData.subjects.find((s) => s.id === i);
        if (subjectDetail) subjectFilter.push({ value: i, label: subjectDetail.name });
      });
      filter.subjectId = subjectFilter;
    }
    if (filter.classId) {
      const classFilter = [];
      filter.classId.split(',').forEach((i) => {
        const classDetail = this.props.filterData.classes.find((c) => c.id === i);
        if (classDetail) classFilter.push({ value: i, label: classDetail.name });
      });
      filter.classId = classFilter;
    }
    if (filter.yearSchools) {
      const yearFilter = [];
      filter.yearSchools.split(',').forEach((i) => {
        const yearDetail = years.find((y) => y === i);
        if (yearDetail) yearFilter.push({ value: i, label: i });
      });
      filter.yearSchools = yearFilter;
    }
    if (filter.sort) {
      const sortValue = filter.sort.split('.')[1] || 'desc';
      const currentSort = sortOptions.find((i) => i.value === sortValue);
      filter.sort = filter.sort.split('.')[0] === 'createdAt' && currentSort
        ? { value: sortValue, label: currentSort.label } : {};
    } else {
      filter.sort = { value: 'desc', label: 'Mới đăng' };
    }
    return filter;
  }

  loadMoreDocs() {
    const currentQueries = queryString.parse(this.props.location.search);
    const mappedQueries = {};
    Object.keys(currentQueries).forEach((k) => {
      if (acceptedQueryKeys.includes(k)) {
        mappedQueries[k] = currentQueries[k];
      }
    });
    const queries = {
      ...mappedQueries,
      offset: this.props.documents.data.length,
      size: itemsPerLoad,
      cateId: this.props.match.params.id,
    };
    this.props.getDocumentsList(queries);
  }

  handleChangeFilter(name, options) {
    let mappedValue = '';
    if ((name === 'subjectId' || name === 'classId' || name === 'yearSchools') && options.length) {
      mappedValue = options.map((i) => i.value).join();
    }
    if (name === 'sort') {
      mappedValue = `createdAt.${options.value}`;
    }
    const currentFilter = queryString.parse(this.props.location.search);
    const newFilter = { ...currentFilter, [name]: mappedValue };
    this.props.history.push(`${this.props.location.pathname}?${queryString.stringify(newFilter)}`);
  }

  render() {
    const filter = this.mappingQueriesToFilter(this.props.location.search);
    const categories = _.get(this.props, 'categories', []);
    const currentCat = categories.find((c) => c.id ===  this.props.match.params.id);
    const catName = _.get(currentCat, 'name', '');
    return (
      <Wrapper>
        <Helmet>
          <title>{catName}</title>
          <meta name="description" content="Description of UploadDocument" />
        </Helmet>
        <Tab
          key="bo-loc-danh-muc"
          style={{ background: 'white' }}
          title={`Danh mục: ${catName}`}
          className="doc-filters"
          content={
            <React.Fragment>
              <div className="doc-filter">
                <Select
                  key={this.state.resetKey}
                  name="subjectId"
                  value={filter.subjectId}
                  onChange={this.handleChangeFilter.bind(this, 'subjectId')}
                  options={this.props.filterData.subjects.map((sj) => ({ value: sj.id, label: sj.name }))}
                  isMulti
                  hideSelectedOptions={false}
                  closeMenuOnSelect={false}
                  placeholder={'Chọn môn'}
                  isSearchable={false}
                  components={{
                    DropdownIndicator: () => (
                      <FontAwesomeIcon style={{ margin: '0 5px'}} className={'title-icon'} icon={['fas', 'caret-down']} />
                    ),
                    IndicatorSeparator: () => null,
                  }}
                />
              </div>
              <div className="doc-filter">
                <Select
                  key={this.state.resetKey}
                  name="classId"
                  value={filter.classId}
                  onChange={this.handleChangeFilter.bind(this, 'classId')}
                  options={this.props.filterData.classes.map((cls) => ({ value: cls.id, label: cls.name }))}
                  isMulti
                  hideSelectedOptions={false}
                  closeMenuOnSelect={false}
                  placeholder={'Chọn lớp'}
                  isSearchable={false}
                  components={{
                    DropdownIndicator: () => (
                      <FontAwesomeIcon style={{ margin: '0 5px'}} className={'title-icon'} icon={['fas', 'caret-down']} />
                    ),
                    IndicatorSeparator: () => null,
                  }}
                />
              </div>
              <div className="doc-filter">
                <Select
                  key={this.state.resetKey}
                  name="yearSchools"
                  value={filter.yearSchools}
                  onChange={this.handleChangeFilter.bind(this, 'yearSchools')}
                  options={years.map((y) => ({ value: y, label: y }))}
                  isMulti
                  hideSelectedOptions={false}
                  closeMenuOnSelect={false}
                  placeholder={'Năm học'}
                  isSearchable={false}
                  components={{
                    DropdownIndicator: () => (
                      <FontAwesomeIcon style={{ margin: '0 5px'}} className={'title-icon'} icon={['fas', 'caret-down']} />
                    ),
                    IndicatorSeparator: () => null,
                  }}
                />
              </div>
              <div className="doc-filter">
                <Select
                  key={this.state.resetKey}
                  name="sort"
                  value={filter.sort}
                  onChange={this.handleChangeFilter.bind(this, 'sort')}
                  options={sortOptions}
                  // isMulti
                  hideSelectedOptions={false}
                  // closeMenuOnSelect={false}
                  placeholder={'Sắp xếp'}
                  isSearchable={false}
                  components={{
                    DropdownIndicator: () => (
                      <FontAwesomeIcon style={{ margin: '0 5px'}} className={'title-icon'} icon={['fas', 'caret-down']} />
                    ),
                    IndicatorSeparator: () => null,
                  }}
                />
              </div>
            </React.Fragment>
          }
        />
        <Tab
          key="latest-docs"
          title="Tài liệu khác liên quan"
          className="grey-box"
          customTitle={
            <GreyTitle className="custom-title">
              <p>Hiện có <span className="red">{this.props.documents.total}</span> tài liệu tại phần này</p>
            </GreyTitle>
          }
          content={
            this.props.loading
              ? <LoadingIndicator />
              : (<div>
                {this.state.downloadingFile
              ? <div className="data-loading">Vui lòng chờ xử lý...<LoadingIndicator /></div> : null}
                <List
                  items={this.props.documents.data}
                  component={ListItem}
                  loadMore={this.props.documents.data.length < this.props.documents.total}
                  onLoadMore={this.loadMoreDocs}
                  onDownload={(id, name) => {
                    this.setState({ downloadingFile: name });
                    this.props.requestDownload(id);
                  }}
                  onPreview={doc => {
                    this.props.previewDoc(doc);
                    this.props.getPreview(doc.id);
                  }}
                />
              </div>)
          }
        />
      </Wrapper>
    );
  }
}

Category.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  repos: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  onSubmitForm: PropTypes.func,
  username: PropTypes.string,
  onChangeUsername: PropTypes.func,
  updateQuery: PropTypes.func,
  previewDoc: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    getFilterData: () => dispatch(getFilterData()),
    getDocumentsList: (query, clear) =>
      dispatch(getDocumentsList(query, clear)),
    requestDownload: id => dispatch(requestDownload(id)),
    removeFileSave: () => dispatch(removeFileSave()),
    removeMessage: () => dispatch(removeMessage()),
    updateQuery: query => dispatch(updateQuery(query)),
    previewDoc: doc => dispatch(previewDoc(doc)),
    getPreview: id => dispatch(getPreview(id)),
  };
}

const mapStateToProps = createStructuredSelector({
  document: makeSelectDocument(),
  documents: makeSelectDocuments(),
  filterData: makeSelectFilterData(),
  loading: makeSelectLoading(),
  file: makeSelectFile(),
  message: makeSelectMessage(),
  categories: makeSelectCategories(),
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
)(withRouter(Category));
