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
import { faCog, faFolder, faCloudDownloadAlt, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faMoneyBillAlt, faClock } from '@fortawesome/free-regular-svg-icons';
import _ from 'lodash';
import moment from 'moment';
import { Link } from 'react-router-dom';
import Countdown from 'react-countdown-now';
// import { Document, Page } from 'react-pdf';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import {
  requestDownload,
  removeFileSave,
  removeMessage,
  getPreview,
  previewDoc,
} from 'containers/HomePage/actions';
import Tab from 'components/Tab';
import LoadingIndicator from 'components/LoadingIndicator';
import downloading from 'images/download.gif';
import { getDocumentDetails, getDocumentsList } from './actions';
import {
  makeSelectDocument,
  makeSelectLoading,
  makeSelectDocuments,
} from './selectors';
import {
  makeSelectFile,
  makeSelectMessage,
} from 'containers/HomePage/selectors';
import reducer from './reducer';
import saga from './saga';
import Wrapper from './Wrapper';
import Button from './Button';

library.add(faMoneyBillAlt, faFolder, faCog, faCloudDownloadAlt, faCheck, faClock, faTimes);

const numberWithCommas = (x) => {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

const itemsPerLoad = 10;

const errorMapping = {
  unknown_error_download: 'Tài liệu không còn tồn tại hoặc có lỗi, vui lòng báo lại cho admin!',
  not_enough_money: 'Tài khoản không còn đủ tiền để thanh toán, vui lòng nạp thêm!',
};

const mockAnswears = ['A', 'B', 'A', 'C', 'B', 'C', 'B', 'C', 'B'];

/* eslint-disable react/prefer-stateless-function */
export class DocumentDetails extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      data: null,
      time: 100000,
      answears: {},
      questions: [
        {
          id: 1,
          questions: ['A', 'B', 'C', 'D'],
        },
        {
          id: 2,
          questions: ['A', 'B', 'C', 'D'],
        },
        {
          id: 3,
          questions: ['A', 'B', 'C', 'D'],
        },
        {
          id: 4,
          questions: ['A', 'B', 'C', 'D'],
        },
        {
          id: 5,
          questions: ['A', 'B', 'C', 'D'],
        },
        {
          id: 6,
          questions: ['A', 'B', 'C', 'D'],
        },
        {
          id: 7,
          questions: ['A', 'B', 'C', 'D'],
        },
        {
          id: 8,
          questions: ['A', 'B', 'C', 'D'],
        },
        {
          id: 9,
          questions: ['A', 'B', 'C', 'D'],
        },
      ],
      rightAnswears: null,
    };
    this.loadMoreDocs = this.loadMoreDocs.bind(this);
    this.handleDownloadFile = this.handleDownloadFile.bind(this);
    this.showPreview = this.showPreview.bind(this);
    this.tick = this.tick.bind(this);
    this.stopCountdown = this.stopCountdown.bind(this);
    this.selectAnswear = this.selectAnswear.bind(this);
    this.submitAnswears = this.submitAnswears.bind(this);
  }

  componentWillMount() {
    window.scrollTo(0, 0);
    if (this.props.match.params.id) {
      this.props.getDocumentDetails(this.props.match.params.id);
    }
    // if (!this.props.documents.data.length) {
    //   this.props.getDocumentsList({
    //     sort: 'createdAt.desc',
    //     offset: 0,
    //     size: itemsPerLoad,
    //   });
    // }
  }

  componentWillReceiveProps(nextProps) {
    // if (this.props.match.params.id !== nextProps.match.params.id) {
    //   window.scrollTo(0, 0);
    //   this.props.getDocumentDetails(nextProps.match.params.id);
    //   this.props.getDocumentsList({
    //     sort: 'createdAt.desc',
    //     offset: 0,
    //     size: itemsPerLoad,
    //   }, true);
    // }
    // if (!this.props.file && nextProps.file) {
    //   const blob = new Blob([nextProps.file]);
    //   FileSaver.saveAs(
    //     blob,
    //     `${_.get(this.props, 'document.name', 'download')}.${
    //       _.get(this.props, 'document.path', 'name.doc').split('.')[1]
    //     }`,
    //   );
    //   this.props.removeFileSave();
    //   this.setState({ loading: false });
    // }
  }

  componentDidMount() {
    this.timeInterval = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    // this.props.removeMessage();
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  tick() {
    this.setState({ time: this.state.time - 1000 })
  }

  stopCountdown() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
    this.submitAnswears();
  }
  
  submitAnswears() {
    this.setState({ rightAnswears: mockAnswears });
  }

  selectAnswear(questionId, answear) {
    this.setState({
      answears: {
        ...this.state.answears,
        [questionId]: answear,
      }
    });
  }

  renderAnswearSheet(data, currentAnswears, rightAnswears) {
    if (rightAnswears) {
      return data.map((q) => {
        return (
          <div key={q.id} className="answear-line">
            <span>{q.id}</span>
            {q.questions.map((o) => {
              if (currentAnswears[q.id] === o && rightAnswears[q.id - 1] === o) {
                return (<button key={o} onClick={() => this.selectAnswear(q.id, o)} className="answear-item checked">
                  <FontAwesomeIcon className={'title-icon'} icon={['fas', 'check']} />
                </button>)
              } else if (currentAnswears[q.id] === o && rightAnswears[q.id - 1] !== o) {
                return (<button key={o} onClick={() => this.selectAnswear(q.id, o)} className="answear-item checked failed">
                  <FontAwesomeIcon className={'title-icon'} icon={['fas', 'times']} />
                </button>)
              } else if (rightAnswears[q.id - 1] === o) {
                return (<button key={o} onClick={() => this.selectAnswear(q.id, o)} className="answear-item checked passed">
                  <FontAwesomeIcon className={'title-icon'} icon={['fas', 'check']} />
                </button>)
              } else {
                return (<button key={o} onClick={() => this.selectAnswear(q.id, o)} className="answear-item">{o}</button>)
              }
            })}
          </div>
        );
      });
    }
    return data.map((q) => {
      return (
        <div key={q.id} className="answear-line">
          <span>{q.id}</span>
          {q.questions.map((o) => (
            currentAnswears[q.id] === o
              ? (<button key={o} onClick={() => this.selectAnswear(q.id, o)} className="answear-item checked">
                <FontAwesomeIcon className={'title-icon'} icon={['fas', 'check']} />
              </button>)
              : (<button key={o} onClick={() => this.selectAnswear(q.id, o)} className="answear-item">{o}</button>)
          ))}
        </div>
      );
    });
  }

  loadMoreDocs() {
    this.props.getDocumentsList({
      sort: 'createdAt.desc',
      offset: this.props.documents.data.length,
      size: itemsPerLoad,
    });
  }

  handleDownloadFile() {
    this.setState({ loading: true });
    this.props.requestDownload(this.props.match.params.id);
  }

  showPreview() {
    this.setState({ preview: true });
  }

  render() {
    const { document } = this.props;
    return (
      <Wrapper>
        <Helmet>
          <title>Tài liệu {` ${_.get(document, 'name')}`}</title>
          <meta name="description" content="Description of UploadDocument" />
        </Helmet>
        <Tab
          key="chi-tiet-tai-lieu"
          style={{ background: 'white' }}
          title={`Tài liệu: ${_.get(document, 'name')}`}
          className="doc-preview"
          content={
            this.props.loading || this.state.loading ? (
              <div className="data-loading">
                Vui lòng chờ xử lý...
                <LoadingIndicator />
              </div>
            ) : (
              <div style={{ maxHeight: '1000px', overflow: 'auto' }}>
                {this.props.document.images && (
                  _.get(this.props.document, 'images', [])
                    .map((imgData, index) =>
                      <div key={`preview-${index}`} ><img
                        src={`data:image/png;base64,${imgData}`}
                        alt="preview"
                      /></div>)
                )}
              </div>
            )
          }
        />
        <Tab
          key="dap-an-tai-lieu"
          style={{ background: 'white' }}
          title={`Tài liệu: ${_.get(document, 'name')}`}
          className="doc-answear-sheet"
          customTitle={<p></p>}
          content={
            this.props.loading || this.state.loading ? (
              <div className="data-loading">
                Vui lòng chờ xử lý...
                <LoadingIndicator />
              </div>
            ) : (
              <div>
                <div className="answear-countdown">
                  <div className="time-countdown">
                    <FontAwesomeIcon className={'title-icon'} icon={['far', 'clock']} />
                    <Countdown
                      date={this.state.time}
                      onTick={this.tick}
                      onComplete={this.submitAnswears}
                      controlled
                    >
                      <span>Hết giờ!</span>
                    </Countdown>
                  </div>
                  <Button className="submit-answear-btn" color={'#cc0000'} onClick={this.stopCountdown}>Nộp bài</Button>
                </div>
                <div className="answear-section">
                  {this.state.rightAnswears 
                    ? (<div className="final-result">
                      <div className="icon-meaning">
                        <button className="answear-item checked">
                          <FontAwesomeIcon className={'title-icon'} icon={['fas', 'check']} />
                        </button> ĐÁP ÁN
                      </div>
                      <div className="icon-meaning">
                        <button className="answear-item checked passed">
                          <FontAwesomeIcon className={'title-icon'} icon={['fas', 'check']} />
                        </button> ĐÚNG
                      </div>
                      <div className="icon-meaning">
                        <button className="answear-item checked failed">
                          <FontAwesomeIcon className={'title-icon'} icon={['fas', 'times']} />
                        </button> SAI
                      </div>
                    </div>)
                    : (<p>
                      <span className="bold">
                        PHẦN TRẢ LỜI:
                      </span> <span className="answear-percent">
                        {Object.keys(this.state.answears).length}/{this.state.questions.length}
                      </span>
                    </p>)}
                  {this.renderAnswearSheet(this.state.questions, this.state.answears, this.state.rightAnswears)}
                </div>
              </div>
            )
          }
        />
      </Wrapper>
    );
  }
}

DocumentDetails.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  repos: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  onSubmitForm: PropTypes.func,
  username: PropTypes.string,
  onChangeUsername: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    getDocumentDetails: (id) => dispatch(getDocumentDetails(id)),
    getDocumentsList: (query, clear) => dispatch(getDocumentsList(query, clear)),
    requestDownload: (id) => dispatch(requestDownload(id)),
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
  loading: makeSelectLoading(),
  file: makeSelectFile(),
  message: makeSelectMessage(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'documentTest', reducer });
const withSaga = injectSaga({ key: 'documentTest', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(DocumentDetails);
