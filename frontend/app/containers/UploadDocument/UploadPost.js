import React from 'react';
import Dropzone from 'react-dropzone';
import Request from 'superagent';
import styled from 'styled-components';

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

class UploadPost extends React.Component {
  constructor() {
    super()
    this.state = { files: [] }
  }

  /*We will be using Request.post() to the send our post request
  "http://posttestserver.com/post.php?dir=example" was used for testing our post request
  '.set' is where we give our headers
  '.send' is where we attach the file that is to be sent
  * '.attach' can also be used to send a file
  '.on' is used to find out the progress of the file upload
  For demonstration purpose we just show the value of percentage complete
  The value can be passed to progress bar and can also be used to calculate time remaining*/
  onDrop(files) {
    files.forEach(element => {
      Request.post('http://localhost:3000/profile')
        .set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
        .send(element)
        .on('progress', function(e) {
          console.log('Progress', e.percent);
          this.setState({
            files,
          })
        }.bind(this))
        .end((err, res) => {
            console.log(err);
            console.log(res);
        })
    });
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
        <aside>
          <ul className="list-item-upload">
            {
              this.state.files.map((f, ind) => <li key={ind}>
                <div><text>{f.name} - {f.size} bytes</text><span>Hủy tải lên X</span></div>
                <progress value="22" max="100"></progress>
              </li>)
            }
          </ul>
        </aside>
      </section>
    );
  }
}

export default UploadPost;