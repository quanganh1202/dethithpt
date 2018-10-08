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
import _ from 'lodash';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import Tab from 'components/Tab';
import List from 'components/List';
import ListItem from 'components/ListItem';
import LoadingIndicator from 'components/LoadingIndicator';
import { getFilterData, getDocumentsList } from './actions';
import { requestDownload, removeFileSave, removeMessage, updateQuery } from 'containers/HomePage/actions';
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

    const queries = {
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
    if (this.props.match.params.id !== nextProps.match.params.id) {
      window.scrollTo(0, 0);
      const queries = {
        sort: 'createdAt.desc',
        size: itemsPerLoad,
        cateId: nextProps.match.params.id,
      };
      this.props.getDocumentsList(queries, true);
      this.setState({
        filter: {
          subjectId: '',
          classId: '',
          yearSchools: '',
          sort: { value: 'desc', label: 'Mới đăng' },
        },
        resetKey: Math.random(),
      });

      // Update filter for Collections
      this.props.updateQuery({
        cateId: nextProps.match.params.id,
      });
    }
    if (!this.props.file && nextProps.file) {
      const blob = new Blob([nextProps.file]);
      FileSaver.saveAs(blob, _.get(this.state, 'downloadingFile', 'download'));
      this.setState({ downloadingFile: '' });
      this.props.removeFileSave();
    }
    if (!this.props.message && nextProps.message) {
      this.setState({ downloadingFile: '' });
      alert(errorMapping[nextProps.message] || 'Có lỗi xảy ra, vui lòng báo lại cho admin!');
      this.props.removeMessage();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const currentFilter = {
      ...this.state.filter,
      cateId: this.props.match.params.id,
    };
    const prevFilter = {
      ...prevState.filter,
      cateId: prevProps.match.params.id,
    };

    if (!_.isEqual(currentFilter, prevFilter)) {
      const queryCollection = {
        cateId: currentFilter.cateId,
      };
      Object.keys(currentFilter).forEach(key => {
        if (
          ['classId', 'subjectId', 'yearSchools'].includes(key) &&
          currentFilter[key] &&
          _.isArray(currentFilter[key]) &&
          currentFilter[key].length > 0
        ) {
          queryCollection[key] = currentFilter[key]
            .map(t => t.value)
            .toString();
        }
      });

      this.props.updateQuery(queryCollection);
    }
  }

  loadMoreDocs() {
    const { filter } = this.state;
    const queries = {
      sort: `createdAt.${filter.sort.value}` || 'createdAt.desc',
      offset: this.props.documents.data.length,
      size: itemsPerLoad,
    }
    Array.from(['subjectId', 'classId', 'yearSchools']).forEach((f) => {
      if (filter[f] && filter[f].length > 0) {
        queries[f] = filter[f].map((i) => i.value).join(',');
      }
    })
    this.props.getDocumentsList(queries);
  }

  handleChangeFilter(name, options) {
    const newFilter = {
      ...this.state.filter,
      [name]: options,
    }
    const queries = {
      sort: `createdAt.${newFilter.sort.value}` || 'createdAt.desc',
      offset: 0,
      size: itemsPerLoad,
      cateId: this.props.match.params.id,
    }
    Array.from(['subjectId', 'classId', 'yearSchools']).forEach((filter) => {
      if (newFilter[filter] && newFilter[filter].length > 0) {
        queries[filter] = newFilter[filter].map((i) => i.value).join(',');
      }
    })
    this.props.getDocumentsList(queries, true);
    this.setState({
      filter: newFilter,
    });
  }

  render() {
    const categories = _.get(this.props, 'categories', []);
    const currentCat = categories.find((c) => c.id ===  this.props.match.params.id);
    const catName = _.get(currentCat, 'name', '');
    return (
      <Wrapper>
        <Helmet>
          <title>Danh mục: {catName}</title>
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
                  value={this.state.filter.subjectId}
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
                  value={this.state.filter.classId}
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
                  value={this.state.filter.yearSchools}
                  onChange={this.handleChangeFilter.bind(this, 'yearSchools')}
                  options={Array(21)
                    .fill((new Date()).getFullYear() - 10)
                    .map((y, idx) => ({ value: y + idx, label: y + idx }))}
                  isMulti
                  hideSelectedOptions={false}
                  closeMenuOnSelect={false}
                  placeholder={'Chọn năm học'}
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
                  value={this.state.filter.sort}
                  onChange={this.handleChangeFilter.bind(this, 'sort')}
                  options={[
                    { value: 'desc', label: 'Mới đăng' },
                    { value: 'asc', label: 'Cũ đến mới' },
                  ]}
                  // isMulti
                  hideSelectedOptions={false}
                  defaultValue={{ value: 'desc', label: 'Mới đăng' }}
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
            this.props.load
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
)(Category);
