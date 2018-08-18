import React from 'react';
import Request from 'superagent';
import styled from 'styled-components';

import DetailForm from './DetailForm';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjozLCJuYW1lIjoiTmd1eeG7hW4gxJDDrG5oIEh1ecOqbiIsImVtYWlsIjoibmd1b2lyYW4yMDAwQGdtYWlsLmNvbSIsInBob25lIjpudWxsLCJyb2xlIjpudWxsLCJib2QiOm51bGwsImNpdHkiOm51bGwsImRpc3RyaWN0IjpudWxsLCJsZXZlbCI6bnVsbCwic2Nob29sIjpudWxsLCJmYWNlYm9vayI6bnVsbCwicG9zaXRpb24iOm51bGwsInN1cnBsdXMiOiIwIiwidG90YWxJbmNvbWUiOiIwIiwicmVjaGFyZ2UiOiIwIiwiYWN0aXZlIjoyLCJjcmVhdGVkQXQiOiIyMDE4LTA4LTE4VDA2OjM1OjM5LjAwMFoifSwiaWF0IjoxNTM0NTc0MjgxLCJleHAiOjE1MzgxNzQyODF9.fR7Tz9WHIVxLRwSY3fVHSE9DSjtikJF0hkI0H2Mo0rc';

class UploadProgress extends React.Component {
  constructor() {
    super()
    this.state = { percent: 0 }
  }

  componentDidMount() {
    Request.post('http://125.212.250.92:3000/documents')
      .set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
      .set('Authorization', 'Bearer ' + token)
      .send(this.props.file)
      .on('progress', function(e) {
        this.setState({
          percent: e.percent,
        })
      }.bind(this))
      .end((err, res) => {
          console.log(err);
          console.log(res);
      })
  }

  render() {
    const { file, add2All, onSubmit, index } = this.props;
    return (
      <div>
        <div><span>{file.name} - {file.size} bytes</span><span>Hủy tải lên X</span></div>
        <progress value={this.state.percent} max={100}></progress>
        {!add2All ? <DetailForm id={index} name={file.name} onSubmit={onSubmit} /> : null}
      </div>
    );
  }
}

export default UploadProgress;