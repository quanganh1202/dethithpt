import React from 'react';
import Dropzone from 'react-dropzone';
import Request from 'superagent';
import styled from 'styled-components';
import ToggleButton from 'react-toggle-button';

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

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjozLCJuYW1lIjoiTmd1eeG7hW4gxJDDrG5oIEh1ecOqbiIsImVtYWlsIjoibmd1b2lyYW4yMDAwQGdtYWlsLmNvbSIsInBob25lIjpudWxsLCJyb2xlIjpudWxsLCJib2QiOm51bGwsImNpdHkiOm51bGwsImRpc3RyaWN0IjpudWxsLCJsZXZlbCI6bnVsbCwic2Nob29sIjpudWxsLCJmYWNlYm9vayI6bnVsbCwicG9zaXRpb24iOm51bGwsInN1cnBsdXMiOiIwIiwidG90YWxJbmNvbWUiOiIwIiwicmVjaGFyZ2UiOiIwIiwiYWN0aXZlIjoyLCJjcmVhdGVkQXQiOiIyMDE4LTA4LTE4VDA2OjM1OjM5LjAwMFoifSwiaWF0IjoxNTM0NTc0MjgxLCJleHAiOjE1MzgxNzQyODF9.fR7Tz9WHIVxLRwSY3fVHSE9DSjtikJF0hkI0H2Mo0rc';

class UploadPost extends React.Component {
  constructor() {
    super()
    this.state = { files: [] }
  }

  onDrop(files) {    
    this.setState({
      files,
    });
  }

  onSubmit() {

  }

  render() {
    console.log(this.state.files);
    return (
      <section>
        <div className="dropzone">
          <Dropzone onDrop={this.onDrop.bind(this)}>
            <ButtonUpload>Chọn tệp</ButtonUpload>
            <p>Chọn nút tải lên để chọn nhiều file từ máy tính của bạn hoặc kéo file thả vào đây</p>
            <em>Ấn nút Shift hoặc Ctrl để chọn nhiều file</em>
          </Dropzone>
        </div>
        {this.state.files.length > 0 ? (<aside>
          <div className="form-group">
            <ToggleButton
              value={ this.state.add2All || false }
              onToggle={(value) => {
                this.setState({
                  add2All: !value,
                })
              }} />
            <span>Thêm thông tin cho toàn bộ tài liệu tải lên</span>
          </div>
          {this.state.add2All ? <DetailForm onSubmit={this.onSubmit} /> : null}
          <ul className="list-item-upload">
            {
              this.state.files.map((f, ind) => <UploadProgress onSubmit={this.onSubmit} file={f} key={`file-${ind}`} />)
            }
          </ul>
        </aside>) : null }
      </section>
    );
  }
}

export default UploadPost;