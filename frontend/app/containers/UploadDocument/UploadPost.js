import React from 'react';
import Dropzone from 'react-dropzone';
import styled from 'styled-components';
import Toggle from 'react-toggle';
import { fromJS } from 'immutable';

import DetailForm from './DetailForm';
import UploadProgress from './UploadProgress';

const ButtonUpload = styled.div`
  background: #00a884;
  width: 200px;
  height: 40px;
  border-radius: 5px;
  font-size: 1.5em;
  font-weight: bold;
  color: #fff;
  text-align: center;
  padding: 3px;
  margin: 0 auto;
`;

const Wrapper = styled.section`
  .react-toggle {
    margin-right: 8px;
    vertical-align: middle;
    touch-action: pan-x;

    display: inline-block;
    position: relative;
    cursor: pointer;
    background-color: transparent;
    border: 0;
    padding: 0;

    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    -webkit-tap-highlight-color: rgba(0,0,0,0);
    -webkit-tap-highlight-color: transparent;
  }

  .react-toggle-screenreader-only {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }

  .react-toggle--disabled {
    cursor: not-allowed;
    opacity: 0.5;
    -webkit-transition: opacity 0.25s;
    transition: opacity 0.25s;
  }

  .react-toggle-track {
    width: 50px;
    height: 24px;
    padding: 0;
    border-radius: 30px;
    background-color: #4D4D4D;
    -webkit-transition: all 0.2s ease;
    -moz-transition: all 0.2s ease;
    transition: all 0.2s ease;
  }

  .react-toggle:hover:not(.react-toggle--disabled) .react-toggle-track {
    background-color: #000000;
  }

  .react-toggle--checked .react-toggle-track {
    background-color: #19AB27;
  }

  .react-toggle--checked:hover:not(.react-toggle--disabled) .react-toggle-track {
    background-color: #128D15;
  }

  .react-toggle-track-check {
    position: absolute;
    width: 14px;
    height: 10px;
    top: 0px;
    bottom: 0px;
    margin-top: auto;
    margin-bottom: auto;
    line-height: 0;
    left: 8px;
    opacity: 0;
    -webkit-transition: opacity 0.25s ease;
    -moz-transition: opacity 0.25s ease;
    transition: opacity 0.25s ease;
  }

  .react-toggle--checked .react-toggle-track-check {
    opacity: 1;
    -webkit-transition: opacity 0.25s ease;
    -moz-transition: opacity 0.25s ease;
    transition: opacity 0.25s ease;
  }

  .react-toggle-track-x {
    position: absolute;
    width: 10px;
    height: 10px;
    top: 0px;
    bottom: 0px;
    margin-top: auto;
    margin-bottom: auto;
    line-height: 0;
    right: 10px;
    opacity: 1;
    -webkit-transition: opacity 0.25s ease;
    -moz-transition: opacity 0.25s ease;
    transition: opacity 0.25s ease;
  }

  .react-toggle--checked .react-toggle-track-x {
    opacity: 0;
  }

  .react-toggle-thumb {
    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1) 0ms;
    position: absolute;
    top: 1px;
    left: 1px;
    width: 22px;
    height: 22px;
    border: 1px solid #4D4D4D;
    border-radius: 50%;
    background-color: #FAFAFA;

    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;

    -webkit-transition: all 0.25s ease;
    -moz-transition: all 0.25s ease;
    transition: all 0.25s ease;
  }

  .react-toggle--checked .react-toggle-thumb {
    left: 27px;
    border-color: #19AB27;
  }

  .react-toggle--focus .react-toggle-thumb {
    -webkit-box-shadow: 0px 0px 3px 2px #0099E0;
    -moz-box-shadow: 0px 0px 3px 2px #0099E0;
    box-shadow: 0px 0px 2px 3px #0099E0;
  }

  .react-toggle:active:not(.react-toggle--disabled) .react-toggle-thumb {
    -webkit-box-shadow: 0px 0px 5px 5px #0099E0;
    -moz-box-shadow: 0px 0px 5px 5px #0099E0;
    box-shadow: 0px 0px 5px 5px #0099E0;
  }
`;

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjozLCJuYW1lIjoiTmd1eeG7hW4gxJDDrG5oIEh1ecOqbiIsImVtYWlsIjoibmd1b2lyYW4yMDAwQGdtYWlsLmNvbSIsInBob25lIjpudWxsLCJyb2xlIjpudWxsLCJib2QiOm51bGwsImNpdHkiOm51bGwsImRpc3RyaWN0IjpudWxsLCJsZXZlbCI6bnVsbCwic2Nob29sIjpudWxsLCJmYWNlYm9vayI6bnVsbCwicG9zaXRpb24iOm51bGwsInN1cnBsdXMiOiIwIiwidG90YWxJbmNvbWUiOiIwIiwicmVjaGFyZ2UiOiIwIiwiYWN0aXZlIjoyLCJjcmVhdGVkQXQiOiIyMDE4LTA4LTE4VDA2OjM1OjM5LjAwMFoifSwiaWF0IjoxNTM0NTc0MjgxLCJleHAiOjE1MzgxNzQyODF9.fR7Tz9WHIVxLRwSY3fVHSE9DSjtikJF0hkI0H2Mo0rc';

class UploadPost extends React.Component {
  constructor() {
    super()
    this.state = { files: fromJS([]) };

    this.handleDeleteFile = this.handleDeleteFile.bind(this);
    this.handleAdd2All = this.handleAdd2All.bind(this);
    this.handleChangeSelected = this.handleChangeSelected.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onDrop(listFiles) {
    const { files } = this.state;
    let newFiles;
    if (files.count()) {
      newFiles = files.concat(fromJS(listFiles.map((f) => ({ content: f, show: this.state.add2All }))));
    } else {
      newFiles = fromJS(listFiles.map((f) => ({ content: f, show: false })));
    }
    this.setState({
      files: newFiles,
    });
  }

  handleDeleteFile(index) {
    this.setState({
      files: this.state.files.filter((f, i) => i !== index),
    });
  }

  handleAdd2All(event) {
    this.setState({
      add2All: event.target.checked,
      files: this.state.files.map((f) => f.set('show', event.target.checked)),
    });
  }

  handleChangeSelected(index, value) {
    this.setState({
      files: this.state.files.setIn([index, 'show'], value),
    });
  }

  onSubmit(form) {
    delete form.name;
    this.setState({
      files: this.state.files.map(f => f.set('sendNow', form)),
    });
  }

  render() {
    return (
      <Wrapper>
        <div className="dropzone">
          <Dropzone onDrop={this.onDrop.bind(this)}>
            <ButtonUpload>{this.state.files.count() > 0 ? 'Chọn thêm' : 'Chọn tệp'}</ButtonUpload>
            <p>Chọn nút tải lên để chọn nhiều file từ máy tính của bạn hoặc kéo file thả vào đây</p>
            <em>Ấn nút Shift hoặc Ctrl để chọn nhiều file</em>
          </Dropzone>
        </div>
        {this.state.files.count() > 0 ? (<aside>
          <div className="form-group">
            <label>
              <Toggle
                defaultChecked={this.state.add2All}
                icons={false}
                onChange={this.handleAdd2All} />
                <span>Thêm thông tin cho toàn bộ tài liệu tải lên</span>
            </label>
          </div>
          {this.state.add2All ? <DetailForm onSubmit={this.onSubmit} /> : null}
          <ul className="list-item-upload">
            {
              this.state.files.map((f, ind) => 
                <UploadProgress
                  sendNow={f.get('sendNow')}
                  showSelected={f.get('show')}
                  add2All={this.state.add2All}
                  handleDeleteFile={this.handleDeleteFile}
                  fileIndex={ind}
                  file={f.get('content')}
                  key={`file-${ind}`}
                  handleChangeSelected={this.handleChangeSelected}
                />
              )
            }
          </ul>
        </aside>) : null }
      </Wrapper>
    );
  }
}

export default UploadPost;