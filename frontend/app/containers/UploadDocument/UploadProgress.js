import React from 'react';
import { post, put } from 'axios';
import styled from 'styled-components';

import { getUser } from 'services/auth';
import DetailForm from './DetailForm';
import ErrorMessage from './ErrorMessage';

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

  & progress::-moz-progress-bar, progress::-webkit-progress-value { background: red; }

  & .docs-name {
    font-weight: bold;
  }
`;

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Im5hbWUiOiJOZ3V54buFbiDEkMOsbmggSHV5w6puIiwiZW1haWwiOiJuZ3VvaXJhbjIwMDBAZ21haWwuY29tIiwic3RhdHVzIjoyfSwiaWF0IjoxNTM0NjA0Mzk0LCJleHAiOjE1MzgyMDQzOTR9.8ecwPSZDBY3erg_K0ZiSgs1Nq9YWSmtJKeVfJb47qXk';

class UploadProgress extends React.Component {
  constructor() {
    super()
    this.state = { percent: 0 };

    this.fileUpload = this.fileUpload.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.sendNow && nextProps.sendNow && !this.state.successId) {
      this.fileUpload({
        name: this.props.name,
        ...nextProps.sendNow,
      });
    }
  }

  fileUpload(form) {
    const { file } = this.props;
    const url = '/api/documents';
    const formData = new FormData();
    Object.keys(form).forEach((f) => formData.append(f, form[f]));
    const currentUser = getUser();
    formData.append('userId', 5);
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
      formData.append('fileUpload', file);
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
        {percent ? <progress value={percent} max={100} className={`${ this.state.successId ? 'success' : '' }`}></progress> : null}
        {!showSelected && !this.state.successId ? <DetailForm name={file.name} onSubmit={this.fileUpload} /> : null}
        {this.state.error ? <ErrorMessage>{this.state.error}</ErrorMessage> : null}
      </Wrapper>
    );
  }
}

export default UploadProgress;