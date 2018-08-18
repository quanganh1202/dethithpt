import React from 'react';
import Dropzone from 'react-dropzone';
import Request from 'superagent';
import styled from 'styled-components';
import ToggleButton from 'react-toggle-button';

import DetailForm from './DetailForm';

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

const token = '';

class UploadPost extends React.Component {
  constructor() {
    super()
    this.state = { files: [] }
  }

  onDrop(files) {
    files.forEach(element => {
      Request.post('http://125.212.250.92:3000/documents')
        .set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
        .set('Authorization', 'Bearer ' + token)
        .send(element)
        .on('progress', function(e) {
          console.log('Progress', e.percent);
          
        }.bind(this))
        .end((err, res) => {
            console.log(err);
            console.log(res);
        })
    });
    this.setState({
      files,
    })
  }

  render() {
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
          {this.state.add2All ? <DetailForm /> : null}
          <ul className="list-item-upload">
            {
              this.state.files.map((f, ind) => <li key={ind}>
                <div><span>{f.name} - {f.size} bytes</span><span>Hủy tải lên X</span></div>
                <progress value="22" max="100"></progress>
                {!this.state.add2All ? <DetailForm /> : null}
              </li>)
            }
          </ul>
        </aside>) : null }
      </section>
    );
  }
}

export default UploadPost;