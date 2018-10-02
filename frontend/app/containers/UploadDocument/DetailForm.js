import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import TagsInput from 'react-tagsinput';
import { fromJS } from 'immutable';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCog,
  faFolder,
  faCloudDownloadAlt,
  faCaretDown,
} from '@fortawesome/free-solid-svg-icons';
import { faMoneyBillAlt } from '@fortawesome/free-regular-svg-icons';
import Autosuggest from 'react-autosuggest';

import Select, { Creatable } from 'react-select';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import Button from './Button';

library.add(faMoneyBillAlt, faFolder, faCog, faCloudDownloadAlt, faCaretDown);

const numberWithCommas = (x) => {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

const Wrapper = styled.section`
  margin-top: 10px;

  .rdw-editor-main {
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 2px;
    padding: 0 10px;
  }

  .rdw-editor-toolbar {
    border: 1px solid #ccc;
  }

  label {
    /* Other styling.. */
    text-align: right;
    clear: both;
    float: left;
    margin-right: 15px;
    width: 20%;
  }

  .form-group:after {
    clear: both;
    display: table;
    content: ' ';
  }

  .form-group {
    margin-bottom: 15px;

    .form-control {
      width: 70%;
      float: left;
    }

    input.form-control,
    textarea.form-control,
    .form-tags {
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
        content: ' x';
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
      editorState: EditorState.createEmpty(),
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChangeTag = this.handleChangeTag.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.onEditorStateChange = this.onEditorStateChange.bind(this);
  }

  onEditorStateChange(editorState) {
    this.setState({
      editorState,
      formData: this.state.formData.set(
        'description',
        draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())),
      ),
    });
  }

  handleDelete(i) {
    const { tags } = this.state;
    this. setState({
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
        if (!re.test(value.replace(/,/g, ''))) {
          newValue = value ? formData.get(name, '') : '';
        }
        break;
      }
      case 'filePreview':
        newValue = event.target.files[0];
      break;
      default:
        break;
    }
    // const temp = formData.set(name, newValue.replace(/,/g, ''));
    const temp = formData.set(name, newValue.replace(/,/g, ''));
    this.setState({ formData: temp });
  }

  handleChangeTag(tags) {
    this.setState({ formData: this.state.formData.set('tags', tags) });
  }

  onSubmit() {
    const { formData } = this.state;
    let newData = formData.set('tags', formData.get('tags').join(','));
    Array.from(['subjectIds', 'classIds', 'cateIds', 'collectionIds']).forEach(
      field => {
        if (newData.has(field) && newData.get(field).length > 0) {
          newData = newData.set(field, newData.get(field).map(i => i.value));
        } else {
          newData = newData.delete(field);
        }
      },
    );
    Array.from(['yearSchools']).forEach(field => {
      if (newData.has(field)) {
        newData = newData.set(field, newData.get(field).value);
      }
    });

    this.props.onSubmit(newData.toJS());
  }

  handleOnChange(e) {
    if (e.type === 'enter') {
      e.preventDefault();
    }
  }

  render() {
    const { formData } = this.state;
    const { subjects, classes, categories, tags, collections } = this.props;
    const dataSuggestions = tags.map(tag => ({
      name: tag.tag,
      value: tag.tag,
    }));

    function autocompleteRenderInput({ addTag, ...props }) {
      const handleOnChange = (e, { method }) => {
        if (method === 'enter') {
          e.preventDefault();
        } else {
          props.onChange(e);
        }
      };

      const inputValue =
        (props.value && props.value.trim().toLowerCase()) || '';
      const inputLength = inputValue.length;

      const suggestions = dataSuggestions.filter(
        state => state.name.toLowerCase().slice(0, inputLength) === inputValue,
      );

      return (
        <Autosuggest
          ref={props.ref}
          suggestions={suggestions}
          shouldRenderSuggestions={value => value && value.trim().length > 0}
          getSuggestionValue={suggestion => suggestion.name}
          renderSuggestion={suggestion => <span>{suggestion.name}</span>}
          inputProps={{
            ...props,
            onChange: handleOnChange,
            placeholder: 'Enter để thêm',
          }}
          onSuggestionSelected={(e, { suggestion }) => {
            addTag(suggestion.name);
          }}
          onSuggestionsClearRequested={() => {}}
          onSuggestionsFetchRequested={() => {}}
        />
      );
    }
    return (
      <Wrapper>
        {formData.get('name') ? (
          <div className="form-group">
            <label htmlFor="name">
              Tên tài liệu <i className="required">(*)</i>
            </label>
            <input
              className="form-control"
              name="name"
              value={formData.get('name', '')}
              onChange={this.handleChange}
              required
            />
          </div>
        ) : null}
        {
          (this.props.name && (this.props.name.split('.')[1] === 'zip' || this.props.name.split('.')[1] === 'rar')) ?
          <div className="form-group">
            <label htmlFor="cateIds">&nbsp;</label>
            <input
              className="form-control"
              name="filePreview"
              onChange={this.handleChange}
              type="file"
              required
            />
          </div> : null
        }
        <div className="form-group">
          <label htmlFor="cateIds">&nbsp;</label>
          <div className="form-control">
            <Select
              name="cateIds"
              options={categories.map(sj => ({ value: sj.id, label: sj.name }))}
              value={formData.get('cateIds', '')}
              onChange={value =>
                this.handleChange({ target: { name: 'cateIds', value } })
              }
              isMulti
              hideSelectedOptions={false}
              closeMenuOnSelect={false}
              placeholder="-- Chọn danh mục --"
              isSearchable={false}
              components={{
                DropdownIndicator: () => (
                  <FontAwesomeIcon
                    style={{ margin: '0 5px' }}
                    className="title-icon"
                    icon={['fas', 'caret-down']}
                  />
                ),
              }}
            />
            <Select
              name="subjectIds"
              options={subjects.map(sj => ({ value: sj.id, label: sj.name }))}
              value={formData.get('subjectIds', '')}
              onChange={value =>
                this.handleChange({ target: { name: 'subjectIds', value } })
              }
              hideSelectedOptions={false}
              closeMenuOnSelect={false}
              placeholder="-- Chọn môn --"
              isMulti
              components={{
                DropdownIndicator: () => (
                  <FontAwesomeIcon
                    style={{ margin: '0 5px' }}
                    className="title-icon"
                    icon={['fas', 'caret-down']}
                  />
                ),
              }}
            />
            <Select
              name="classIds"
              options={classes.map(sj => ({ value: sj.id, label: sj.name }))}
              value={formData.get('classIds', '')}
              onChange={value =>
                this.handleChange({ target: { name: 'classIds', value } })
              }
              hideSelectedOptions={false}
              closeMenuOnSelect={false}
              placeholder="-- Chọn lớp --"
              isSearchable={false}
              isMulti
              components={{
                DropdownIndicator: () => (
                  <FontAwesomeIcon
                    style={{ margin: '0 5px' }}
                    className="title-icon"
                    icon={['fas', 'caret-down']}
                  />
                ),
                IndicatorSeparator: () => null,
              }}
            />
            <Select
              name="yearSchools"
              options={Array(21)
                .fill(new Date().getFullYear() - 10)
                .map((y, idx) => ({ value: y + idx, label: y + idx }))}
              value={formData.get('yearSchools', '')}
              onChange={value =>
                this.handleChange({ target: { name: 'yearSchools', value } })
              }
              hideSelectedOptions={false}
              closeMenuOnSelect={false}
              placeholder="-- Chọn năm học --"
              components={{
                DropdownIndicator: () => (
                  <FontAwesomeIcon
                    style={{ margin: '0 5px' }}
                    className="title-icon"
                    icon={['fas', 'caret-down']}
                  />
                ),
              }}
            />
            <Creatable
              name="collectionIds"
              options={collections.map(sj => ({
                value: sj.id,
                label: sj.name,
              }))}
              value={formData.get('collectionIds', '')}
              onChange={value =>
                this.handleChange({ target: { name: 'collectionIds', value } })
              }
              hideSelectedOptions={false}
              closeMenuOnSelect={false}
              placeholder="-- Chọn bộ sưu tập --"
              isMulti
              components={{
                DropdownIndicator: () => (
                  <FontAwesomeIcon
                    style={{ margin: '0 5px' }}
                    className="title-icon"
                    icon={['fas', 'caret-down']}
                  />
                ),
              }}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="name">
            Từ khóa <i className="required">(*)</i>
          </label>
          <TagsInput
            className="form-control form-tags"
            value={formData.get('tags')}
            onChange={this.handleChangeTag}
            renderInput={autocompleteRenderInput}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Mô tả</label>
        </div>
        <div className="form-group">
          <Editor
            editorState={this.state.editorState}
            name="description"
            onEditorStateChange={this.onEditorStateChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Giá bán</label>
          <input
            className="form-control"
            name="price"
            value={numberWithCommas(formData.get('price', ''))}
            onChange={this.handleChange}
          />
        </div>
        <div className="form-group">
          <label>&nbsp;</label>
          <Button name="button-save" onClick={this.onSubmit}>
            Lưu
          </Button>
        </div>
      </Wrapper>
    );
  }
}

DetailForm.propTypes = {
  onSubmit: PropTypes.func,
  subjects: PropTypes.any,
  classes: PropTypes.any,
  categories: PropTypes.any,
  tags: PropTypes.any,
  collections: PropTypes.any,
  name: PropTypes.any,
};

export default DetailForm;
