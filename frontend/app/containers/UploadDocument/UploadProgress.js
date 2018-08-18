import React from 'react';
import { post, put } from 'axios';
import styled from 'styled-components';

import DetailForm from './DetailForm';

const ErrorMessage = styled.div`
  background: red;
  color: #fff;
  padding: 5px;
`;

const Wrapper = styled.li`
  position: relative;

  & .upload-cancel {
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
    font-weight: normal;

    span {
      background: #ccc;
      border-radius: 50%;
      width: 10px;
      height: 10px;
      padding: 0 5px;
      font-weight: bold;
      color: #fff;
    }
  }

  & progress {
    margin-top: 10px;
    width: 100%;
  }

  & .docs-name {
    font-weight: bold;
  }
`;

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoxLCJuYW1lIjoiVsWpIEFuaCBExaluZyIsImVtYWlsIjoidnVhbmhkdW5nLmtobXQyazdAZ21haWwuY29tIiwicGhvbmUiOiIwOTk5OTk5OTEyMyIsInJvbGUiOiJzdHVkZW50IiwiYm9kIjoxOTk0LCJjaXR5IjoiSE4iLCJkaXN0cmljdCI6IkNHIiwibGV2ZWwiOiJDMyIsInNjaG9vbCI6IkFCQyIsImZhY2Vib29rIjoibnVsbCIsInBvc2l0aW9uIjoibWVtYmVyIiwic3VycGx1cyI6IjAiLCJ0b3RhbEluY29tZSI6IjAiLCJyZWNoYXJnZSI6IjAiLCJzdGF0dXMiOjEsImNyZWF0ZWRBdCI6IjIwMTgtMDgtMThUMDg6MjU6MTEuMDAwWiJ9LCJpYXQiOjE1MzQ1ODA3MzIsImV4cCI6MTUzODE4MDczMn0.2UQR3r2ulOiSso0TphHLYSj-EyZyHC1L8OHPCmXwC_8';

class UploadProgress extends React.Component {
  constructor() {
    super()
    this.state = { percent: 0 };

    this.fileUpload = this.fileUpload.bind(this);
  }

  fileUpload(form) {
    const { file } = this.props;
    const url = 'http://125.212.250.92:3000/documents';
    const formData = new FormData();
    Object.keys(form).forEach((f) => formData.append(f, form[f]));
    
    formData.append('tags', '#tags');
    formData.append('userId', 2);
    formData.append('price', 2);
    formData.append('cateId', 1);
    formData.append('subjectId', 1);
    formData.append('classId', 1);
    formData.append('yearSchoolId', 1);
    formData.append('collectionId', 1);
    const config = {
      headers: {
          'content-type': 'multipart/form-data',
          'x-access-token': token,
      },
      onUploadProgress: progressEvent => {
        const percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
        this.setState({ percent: percentCompleted })
      }
    }
    
    if (this.state.successId) {
      formData.append('fileUpload', file);
      return put(url, formData,config).then((res) => {
        this.setState({
          successId: true,
        });
      }).catch((err) => {
        this.setState({
          error: err.message,
        });
      });
    } else {
      return post(url, formData,config).then((res) => {
        this.setState({
          successId: true,
        });
      }).catch((err) => {
        this.setState({
          error: err.message,
        });
      });
    }
  }

  handleCancel() {
    console.log(1);
  }

  render() {
    const { file, fileIndex, add2All, showSelected, handleChangeSelected } = this.props;
    const { percent } = this.state;

    return (
      <Wrapper>
        <div className="docs-name">
          {add2All ? <label className="container">
            <input
              type="checkbox"
              onChange={(e) => handleChangeSelected(fileIndex, e.target.checked)}
              checked={showSelected}
              style={{ marginRight: '5px' }}
            />
          </label> : null }
          <span>{file.name} - {file.size} bytes</span>
          <span
            onClick={
              percent && percent !== 100 ?
                this.handleCancel :
                () => this.props.handleDeleteFile(fileIndex)
            }
            className="upload-cancel"
          >
            {percent && percent !== 100 ? 'Hủy tải lên' : 'Xóa'} <span>X</span>
          </span>
        </div>
        {percent ? <progress value={percent} max={100}></progress> : null}
        {!showSelected ? <DetailForm name={file.name} onSubmit={this.fileUpload} /> : null}
        {this.state.error ? <ErrorMessage>{this.state.error}</ErrorMessage> : null}
      </Wrapper>
    );
  }
}

export default UploadProgress;