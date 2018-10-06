import React from 'react';
import { post, put, all } from 'axios';
import styled from 'styled-components';
import _ from 'lodash';

import { getUser, getToken } from 'services/auth';
import winrar from 'images/winrar.png';
import pdf from 'images/pdf.png';
import word from 'images/word.png';
import DetailForm from './DetailForm';
import ErrorMessage from './ErrorMessage';

const Wrapper = styled.li`
  position: relative;

  &.upload-success {
    margin-top: 40px;
  }

  & .upload-notif {
    position: absolute;
    top: -30px;
    background: #eff;
    width: 100%;
    left: 0;
    height: 40px;
    border: 1px solid #36baa2;
    color: #00a37f;
    line-height: 35px;
    padding-left: 10px;
  }

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

  & progress::-moz-progress-bar,
  progress::-webkit-progress-value {
    background: red;
  }

  & .docs-name {
    font-weight: bold;
    padding-right: 50px;
    word-break: break-all;
  }

  & .doc-infor p {
    margin: 0;
    font-weight: normal;
    b {
      margin-right: 5px;
    }
  }

  & .file-type-icon {
    height: 20px;
  }
`;

const DocType = props => {
  let src;
  switch (props.type) {
    case 'application/msword':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      src = word;
      break;
    case 'application/pdf':
      src = pdf;
      break;
    default:
      src = winrar;
      break;
  }
  return <img src={src} alt="file type" className="file-type-icon" />;
};

class UploadProgress extends React.Component {
  constructor() {
    super();
    this.state = { percent: 0 };

    this.fileUpload = this.fileUpload.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.sendNow && nextProps.sendNow && !this.state.successId) {
      this.fileUpload({
        name: this.props.file.name,
        ...nextProps.sendNow,
      });
    }
  }

  fileUpload(form) {
    const { file } = this.props;
    const url = '/api/documents';
    const formData = new FormData();
    Object.keys(form).forEach(f => formData.append(f, form[f]));
    formData.append('userId', getUser().id);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        'x-access-token': getToken(),
      },
      onUploadProgress: progressEvent => {
        const percentCompleted = Math.floor(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
        this.setState({ percent: percentCompleted });
      },
    };

    if (this.state.successId) {
      return put(url, formData, config)
        .then(() => {
          this.setState({
            successId: true,
            error: null,
          });
        })
        .catch(err => {
          this.setState({
            error: err.message,
          });
        });
    }
    const listCollectionCreate = _.pullAll(
      form.collectionIds,
      this.props.collections.map(c => c.id),
    );
    const collectionIds = form.collectionIds.filter(t => t.__isNew__);
    let promiseCreates = [];
    if (collectionIds && collectionIds.length > 0) {
      promiseCreates = collectionIds.map(({ value }) =>
        post(
          '/api/collections',
          {
            cateIds: form.cateIds.toString(),
            classIds: form.classIds.toString(),
            subjectIds: form.subjectIds.toString(),
            yearSchools: form.yearSchools.toString(),
            name: value,
            description: value,
          },
          {
            headers: {
              'content-type': 'application/json;charset=UTF-8',
              'x-access-token': getToken(),
            },
          },
        ),
      );
    }
    return all(promiseCreates).then(response => {
      const listNewCol = response.map(t =>
        t.data.message.split('insertId =')[1].trim(),
      );
      formData.set('collectionIds', [
        ...listNewCol,
        ...form.collectionIds.filter(t => !t.__isNew__).map(c => c.value),
      ]);
      formData.append('fileUpload', file);
      return post(url, formData, config)
        .then(res => {
          this.setState({
            successId: form,
            error: null,
          });
        })
        .catch(err => {
          this.setState({
            error: err.message,
          });
        });
    });
  }

  handleCancel() {}

  render() {
    const {
      file,
      fileIndex,
      add2All,
      showSelected,
      handleChangeSelected,
      subjects,
      classes,
      categories,
      tags,
      collections,
    } = this.props;
    const { percent, successId } = this.state;

    return (
      <Wrapper className={successId ? 'upload-success' : ''}>
        {successId ? (
          <div className="upload-notif">
            Tải lên thành công. Admin sẽ duyệt tài liệu của bạn trong thời gian
            sớm nhất.
          </div>
        ) : null}
        <div className="docs-name">
          {add2All && !successId ? (
            <label className="container" htmlFor="name">
              <input
                type="checkbox"
                onChange={e =>
                  handleChangeSelected(fileIndex, e.target.checked)
                }
                checked={showSelected}
                style={{ marginRight: '5px' }}
              />
            </label>
          ) : null}
          <span>
            <DocType type={file.type} /> {file.name} -{' '}
            {(file.size / 1048576).toFixed(3)} MB
          </span>
          {successId ? (
            <div className="doc-infor">
              <p>
                <b>Danh mục: </b>
                {_.get(successId, 'cateIds', []).map(
                  (key, index) =>
                    `${_.get(categories.find(c => c.id === key), 'name')}${
                      index !== _.get(successId, 'cateIds', []).length - 1
                        ? ','
                        : ''
                    } `,
                )}
              </p>
              <p>
                <b>Môn:</b>
                {_.get(successId, 'subjectIds', []).map(
                  (key, index) =>
                    `${_.get(subjects.find(c => c.id === key), 'name')}${
                      index !== _.get(successId, 'subjectIds', []).length - 1
                        ? ','
                        : ''
                    } `,
                )}
              </p>
              <p>
                <b>Lớp:</b>
                {_.get(successId, 'classIds', []).map(
                  (key, index) =>
                    `${_.get(classes.find(c => c.id === key), 'name')}${
                      index !== _.get(successId, 'classIds', []).length - 1
                        ? ','
                        : ''
                    } `,
                )}
              </p>
              <p>
                <b>Năm học:</b>
                {successId.yearSchools.toString()}
              </p>
              <p>
                <b>Bộ sưu tập:</b>
                {_.get(successId, 'collectionIds', []).map(
                  (key, index) =>
                    `${_.get(
                      collections.find(c => c.id === key.value),
                      'name',
                      key.value,
                    )}${
                      index !== _.get(successId, 'collectionIds', []).length - 1
                        ? ','
                        : ''
                    } `,
                )}
              </p>
              <p>
                <b>Từ khóa:</b>
                {successId.tags.toString()}
              </p>
              <p>
                <b>Mô tả:</b>
                <content
                  className="content"
                  dangerouslySetInnerHTML={{ __html: successId.description }}
                />
              </p>
              <p>
                <b>Giá bán:</b>
                {successId.price
                  ? Number(successId.price).toLocaleString('it-IT', {
                    style: 'currency',
                    currency: 'VND',
                  })
                  : 'Miễn phí'}
              </p>
            </div>
          ) : null}
          <span
            onClick={
              percent && percent !== 100
                ? this.handleCancel
                : () => this.props.handleDeleteFile(fileIndex)
            }
            className="upload-cancel"
          >
            {percent && percent !== 100 ? 'Hủy tải lên' : 'Xóa'} <span>X</span>
          </span>
        </div>
        {percent && percent !== 100 ? (
          <progress
            value={percent}
            max={100}
            className={`${successId ? 'success' : ''}`}
          />
        ) : null}
        {!showSelected && !successId ? (
          <DetailForm
            subjects={subjects}
            classes={classes}
            categories={categories}
            tags={tags}
            collections={collections}
            name={file.name}
            onSubmit={this.fileUpload}
          />
        ) : null}
        {this.state.error ? (
          <ErrorMessage>{this.state.error}</ErrorMessage>
        ) : null}
      </Wrapper>
    );
  }
}

export default UploadProgress;
