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

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import Tab from 'components/Tab';
import List from 'components/List';
import ListItem from 'components/ListItem';
import LoadingIndicator from 'components/LoadingIndicator';
import { getFilterData, getDocumentsList } from './actions';
import {
  makeSelectDocument,
  makeSelectLoading,
  makeSelectDocuments,
  makeSelectFilterData,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
import GreyTitle from 'containers/HomePage/GreyTitle';
import Wrapper from './Wrapper';

library.add(faMoneyBillAlt, faFolder, faCog, faCloudDownloadAlt, faCaretDown);

const numberWithCommas = (x) => {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
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
    };
    this.loadMoreDocs = this.loadMoreDocs.bind(this);
    this.handleChangeFilter = this.handleChangeFilter.bind(this);
  }

  componentWillMount() {
    // get filter data
    this.props.getFilterData();
    
    if (!this.props.documents.data.length) {
      const queries = {
        sort: 'createdAt.desc',
        size: 2,
      };
      if (this.props.match.params.id) {
        queries.cateId = this.props.match.params.id
      }
      this.props.getDocumentsList(queries);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id) {
      const queries = {
        sort: 'createdAt.desc',
        size: 2,
        cateId: nextProps.match.params.id,
      }
      this.props.getDocumentsList(queries, true);
      this.setState({
        filter: {
          subjectId: '',
          classId: '',
          yearSchool: '',
          sort: { value: 'desc', label: 'Mới đăng' },
        },
        resetKey: Math.random(),
      })
    }
  }

  loadMoreDocs() {
    const { filter } = this.state;
    const queries = {
      sort: `createdAt.${filter.sort.value}` || 'createdAt.desc',
      offset: this.props.documents.data.length,
      size: 2,
    }
    Array.from(['subjectId', 'classId', 'yearSchool']).forEach((f) => {
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
      size: 2,
      cateId: this.props.match.params.id,
    }
    Array.from(['subjectId', 'classId', 'yearSchool']).forEach((filter) => {
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
    return (
      <Wrapper>
        <Helmet>
          <title>Danh mục</title>
          <meta name="description" content="Description of UploadDocument" />
        </Helmet>
        {this.props.loading
        ? <LoadingIndicator />
        : (
          <React.Fragment>
            <Tab
              key="bo-loc-danh-muc"
              style={{ background: 'white' }}
              title={'Đề thi thử THPT Quốc Gia'}
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
                        MultiValueContainer: () => null,
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
                        MultiValueContainer: () => null,
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
                      name="yearSchool"
                      value={this.state.filter.yearSchool}
                      onChange={this.handleChangeFilter.bind(this, 'yearSchool')}
                      options={Array(21)
                        .fill((new Date()).getFullYear() - 10)
                        .map((y, idx) => ({ value: y + idx, label: y + idx }))}
                      isMulti
                      hideSelectedOptions={false}
                      closeMenuOnSelect={false}
                      placeholder={'Chọn năm học'}
                      isSearchable={false}
                      components={{
                        MultiValueContainer: () => null,
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
                        MultiValueContainer: () => null,
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
                <div>
                  <List
                    items={this.props.documents.data}
                    component={ListItem}
                    loadMore={this.props.documents.data.length < this.props.documents.total}
                    onLoadMore={this.loadMoreDocs}
                  />
                </div>
              }
            />
          </React.Fragment>
        )}
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
};

export function mapDispatchToProps(dispatch) {
  return {
    getFilterData: () => dispatch(getFilterData()),
    getDocumentsList: (query, clear) => dispatch(getDocumentsList(query, clear)),
  };
}

const mapStateToProps = createStructuredSelector({
  document: makeSelectDocument(),
  documents: makeSelectDocuments(),
  filterData: makeSelectFilterData(),
  loading: makeSelectLoading(),
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
