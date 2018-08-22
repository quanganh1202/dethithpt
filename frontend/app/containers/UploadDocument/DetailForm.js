import React from 'react';
import styled from 'styled-components';
import TagsInput from 'react-tagsinput'
import { fromJS } from 'immutable';


import Select from 'components/Select';
import Button from './Button';

const Wrapper = styled.section`
  margin-top: 10px;

  label {
    /* Other styling.. */
    text-align: right;
    clear: both;
    float:left;
    margin-right:15px;
    width: 20%;
  }

  .form-group:after {
    clear: both;
    display: table;
    content: " ";
  }

  .form-group {
    margin-bottom: 15px;

    .form-control {
      width: 70%;
      float: left;
    }

    input.form-control, textarea.form-control, .form-tags {
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 5px 10px;
    }

    select {
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 4px 10px;
      display: block;
      min-width: 200px;
      margin-bottom: 5px;
    }

    .form-tags {
      .react-tagsinput-tag {
        border-radius: 2px;
        border: 1px solid #00a884;
        color: #00a884;
        display: inline-block;
        font-family: sans-serif;
        margin-right: 5px;
        padding: 1px 5px;

        .react-tagsinput-remove {
          color: #00a884;
        }
      }

      .react-tagsinput-remove {
        cursor: pointer;
        font-weight: bold;
      }

      .react-tagsinput-tag a::before {
        content: " x";
      }
    }
  }
`;

class DetailForm extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      formData: fromJS({
        name: this.props.name,
        tags: [],
      }),
      files: [],
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChangeTag = this.handleChangeTag.bind(this);
  }

  handleDelete(i) {
    const { tags } = this.state;
    this.setState({
      tags: tags.filter((tag, index) => index !== i),
    });
  }

  handleChange(event) {
    if (event.preventDefault) event.preventDefault();
    const { formData } = this.state;
    const { name, value } = event.target;
    let newValue = value;
    switch (name) {
      case 'price': {
        const re = /^[0-9\b]+$/;
        if (!re.test(value)) {
          newValue = formData.get(name, '');
        }
        break;
      }
    }
    
    const temp = formData.set(name, newValue)
    this.setState({ formData: temp });
  }

  handleChangeTag(tags) {
    this.setState({ formData: this.state.formData.set('tags', tags) });
  }

  onSubmit() {
    const { formData } = this.state;
    const newData = formData.set('tags', formData.get('tags').join(','));
    this.props.onSubmit(newData.toJS());
  }

  render() {
    const { formData } = this.state;

    return (
      <Wrapper>
        {formData.get('name') ? (<div className="form-group">
          <label htmlFor="name">Tên tài liệu <i className="required">(*)</i></label>
          <input
            className="form-control"
            name="name"  
            value={formData.get('name', '')}
            onChange={this.handleChange}
            required
          />
        </div>) : null}
        <div className="form-group">
          <label htmlFor="category">&nbsp;</label>
          <div className="form-control">
            <Select
              name="cateId"
              options={[
                { text: 'Đề thi', value: 1 },
              ]}
              value={formData.get('cateId', '')}
              defaultText={'-- Chọn danh mục --'}
              onChange={this.handleChange}
            />
            <Select
              name="subjectId"
              options={[
                { text: 'Môn Toán', value: 1 },
              ]}
              value={formData.get('subjectId', '')}
              defaultText={'-- Chọn môn --'}
              onChange={this.handleChange}
            />
            <Select
              name="classId"
              options={[
                { text: 'Lớp 12', value: 1 },
              ]}
              value={formData.get('classId', '')}
              defaultText={'-- Chọn lớp --'}
              onChange={this.handleChange}
            />
            <Select
              name="yearSchoolId"
              options={[
                { text: 'năm 2018', value: 1 },
              ]}
              value={formData.get('yearSchoolId', '')}
              defaultText={'-- Chọn năm học --'}
              onChange={this.handleChange}
            />
            <Select
              name="collectionId"
              options={[
                { text: 'Bộ sưu tập 1', value: 1 },
              ]}
              value={formData.get('collectionId', '')}
              defaultText={'-- Chọn bộ sưu tập --'}
              onChange={this.handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="name">Từ khóa <i className="required">(*)</i></label>
          <TagsInput className="form-control form-tags" value={formData.get('tags')} onChange={this.handleChangeTag} />
        </div>
        <div className="form-group">
          <label htmlFor="name">Mô tả</label>
          <textarea
            className="form-control"
            name="description"
            value={formData.get('description', '')}
            onChange={this.handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Giá bán</label>
          <input
            className="form-control"
            name="price"
            value={formData.get('price', '')}
            onChange={this.handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="button-save">&nbsp;</label>
          <Button name="button-save" onClick={this.onSubmit}>Lưu</Button>
        </div>
      </Wrapper>
    );
  }
}

export default DetailForm;