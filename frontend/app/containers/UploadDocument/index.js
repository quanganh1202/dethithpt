/**
 *
 * UploadDocument
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import styled from 'styled-components';

import Tab from 'components/Tab';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectUploadDocument from './selectors';
import reducer from './reducer';
import saga from './saga';

const Wrapper = styled.div`
  & .continue-button, & div.input-button {
    margin: 0 auto;
    margin-top: 20px;
  }

  & div.input-button {
    padding: 10px;
    width: 200px;
    background: #00a884;
    border:1px solid #00a884;
    position:relative;
    color:#fff;
    border-radius:2px;
    text-align:center;
    cursor:pointer;
    font-weight: bold;
  }

  & .hide_file {
      position: absolute;
      z-index: 1000;
      opacity: 0;
      cursor: pointer;
      right: 0;
      top: 0;
      height: 100%;
      font-size: 24px;
      width: 100%;
      
  }
`;

const Button = styled.button`
  display: block;
  background: #00a884;
  color: #fff;
  font-weight: bold;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

/* eslint-disable react/prefer-stateless-function */
export class UploadDocument extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      stepDefinitions: [
        { id: "step1", title: "1", component: () => <div>
          <label>Nội quy:</label>
          <div style={{ width: '100%', height: '200px' }}></div>
          <label className="container">
            <input type="checkbox" style={{ marginRight: '5px' }} />
            Tôi hoàn toàn đồng ý với các điều khoản của website
          </label>
          <Button onClick={() => this.openCity('step2')} className="continue-button">Tiếp</Button>
        </div> },
        { id: "step2", title: "2", component: () => (
          <div style={{ textAlign: 'center' }}>
            <div className="input-button">
              Chọn tệp
            <input type="file" className="hide_file" multiple  name="upload" onChange={this.handleChange}      
                onDrop={this.handleDrop}
                onDragEnter={this.handleDragEnter}
                onDragOver={this.handleDragOver}
                onDragLeave={this.handleDragLeave} />
            </div>

            <p>Chọn nút tải lên để chọn nhiều file từ máy tính của bạn hoặc kéo file thả vào đây</p>
            <p>Ấn nút Shift hoặc Ctrl để chọn nhiều file</p>
          </div>
        )},
        { id: "step3", title: "3", component: () => <div>1234</div> },
      ]
    };

    this.handleChange = this.handleChange.bind(this);
    this.dropTarget = this.dropTarget.bind(this);
    this.dropLeave = this.dropLeave.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleDragEnter = this.handleDragEnter.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
  }

  componentDidMount() {
    window.addEventListener('dragover', this.dropTarget);
    window.addEventListener('dragleave', this.dropLeave);
    window.addEventListener('drop', this.handleDrop);
  }

  componentWillUnmount() {    
    window.removeEventListener('dragover', this.dropTarget);
    window.removeEventListener('dragleave', this.dropLeave);
    window.removeEventListener('drop', this.handleDrop);
  }

  onFileChange(files) {
    var reader = new FileReader();
    this.fileName = fileObj.name;
    this.fileType = fileObj.type;
    
    reader.onload = function(e) {
      this.file = reader.result;
      this.setState({
        previewing: true
      });
    }
    reader.readAsDataURL(fileObj.file);
  }

  handleChange(e) {
    console.log(e.target.files);
    const files = e.target.files;

    this.onFileChange(Object.keys(files).map((file) => ({
      file: files[file],
      name: files[file].name,
      type: files[file].type
    })));
  }

  dropTarget(e) {    
    if (!this.state.active) {
      this.setState({
        target: true
      });
    }
  }

  dropLeave(e) {
    if(e.screenX === 0 && e.screenY === 0) { // Checks for if the leave event is when leaving the window
    	this.setState({
    	  target: false
    	});
    }
  }

  handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
  
    var uploadObj = {
      target: e.nativeEvent.dataTransfer
    };
    
    this.setState({
      target: false,
      hover: false
    });
    
    this.handleChange(uploadObj);
  }
  
  handleDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!this.state.active) {
      this.setState({
        hover: true
      });
    }
  }

  handleDragLeave(e) {
		this.setState({
      hover: false
    });
  }

  handleDragOver(e) {
    e.preventDefault();
  }

  openCity(cityName) {
    var i;
    var x = document.getElementsByClassName("tab-content");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none"; 
    }
    document.getElementById(cityName).style.display = "block"; 
  }

  render() {
    const { stepDefinitions } = this.state;
    const header = <div className="w3-bar w3-black">{
      stepDefinitions.map((item, key) => 
        <button key={`tab-header-${key}`} className="w3-bar-item w3-button" onClick={() => this.openCity(item.id)}>{item.title}</button>)
    }</div>;
    const content = stepDefinitions.map((item, key) => {
      const Component = item.component;
      return <div
        className="tab-content"
        id={item.id}
        key={`tab-content-${key}`}
        style={{ display: key === 0 ? '' : 'none' }}
        >
        <Component />
      </div>;
    });
    return (
      <Wrapper>
        <Helmet>
          <title>UploadDocument</title>
          <meta name="description" content="Description of UploadDocument" />
        </Helmet>
        
        <Tab key="dang-ban-tai-lieu" style={{ background: 'white' }} title="Đăng tài liệu" content={
          <div style={{ padding: "20px" }}>
            {header}
            {content}
          </div>
        } />
      </Wrapper> 
    );
  }
}

UploadDocument.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  uploaddocument: makeSelectUploadDocument(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'uploadDocument', reducer });
const withSaga = injectSaga({ key: 'uploadDocument', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(UploadDocument);
