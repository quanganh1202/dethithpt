import React from 'react';
import styled from 'styled-components';
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

import Select from 'react-select';
import Button from './Button';

library.add(faMoneyBillAlt, faFolder, faCog, faCloudDownloadAlt, faCaretDown);

const Wrapper = styled.section`
  margin-top: 10px;

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
      files: [],
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChangeTag = this.handleChangeTag.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
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

    const temp = formData.set(name, newValue);
    this.setState({ formData: temp });
  }

  handleChangeTag(tags) {
    this.setState({ formData: this.state.formData.set('tags', tags) });
  }

  onSubmit() {
    const { formData } = this.state;
    let newData = formData.set('tags', formData.get('tags').join(','));
    Array.from(['cateIds']).forEach(field => {
      if (newData.has(field) && newData.get(field).length > 0) {
        newData = newData.set(field, newData.get(field).map(i => i.value));
      } else {
        newData = newData.delete(field);
      }
    });
    Array.from(['subjectId', 'classId', 'yearSchool', 'collectionId']).forEach(
      field => {
        if (newData.has(field)) {
          newData = newData.set(field, newData.get(field).value);
        }
      },
    );
    this.props.onSubmit(newData.toJS());
  }

  handleOnChange(e) {
    if (e.type === 'enter') {
      e.preventDefault();
    } else {
      this.setState({
        inputValue: e.target.value,
      });
    }
  }

  render() {
    const { formData } = this.state;
    const { subjects, classes, categories, tags } = this.props;
    const dataSuggestions = tags.map(tag => ({
      name: tag.tag,
      value: tag.tag,
    }));

    function autocompleteRenderInput({ addTag, ...props }) {
      const handleOnChange = (e, { newValue, method }) => {
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
          inputProps={{ ...props, onChange: handleOnChange }}
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
        <div className="form-group">
          <label htmlFor="category">&nbsp;</label>
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
                MultiValueContainer: () => null,
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
              name="subjectId"
              options={subjects.map(sj => ({ value: sj.id, label: sj.name }))}
              value={formData.get('subjectId', '')}
              onChange={value =>
                this.handleChange({ target: { name: 'subjectId', value } })
              }
              hideSelectedOptions={false}
              closeMenuOnSelect={false}
              placeholder="-- Chọn môn --"
              isSearchable={false}
              components={{
                MultiValueContainer: () => null,
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
              name="classId"
              options={classes.map(sj => ({ value: sj.id, label: sj.name }))}
              value={formData.get('classId', '')}
              onChange={value =>
                this.handleChange({ target: { name: 'classId', value } })
              }
              hideSelectedOptions={false}
              closeMenuOnSelect={false}
              placeholder="-- Chọn lớp --"
              isSearchable={false}
              components={{
                MultiValueContainer: () => null,
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
              name="yearSchool"
              options={Array(21)
                .fill(new Date().getFullYear() - 10)
                .map((y, idx) => ({ value: y + idx, label: y + idx }))}
              value={formData.get('yearSchool', '')}
              onChange={value =>
                this.handleChange({ target: { name: 'yearSchool', value } })
              }
              hideSelectedOptions={false}
              closeMenuOnSelect={false}
              placeholder="-- Chọn năm học --"
              isSearchable={false}
              components={{
                MultiValueContainer: () => null,
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
              name="collectionId"
              options={[{ label: 'Bộ sưu tập 1', value: 1 }]}
              value={formData.get('collectionId', '')}
              onChange={value =>
                this.handleChange({ target: { name: 'collectionId', value } })
              }
              hideSelectedOptions={false}
              closeMenuOnSelect={false}
              placeholder="-- Chọn bộ sưu tập --"
              isSearchable={false}
              components={{
                MultiValueContainer: () => null,
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
          <Button name="button-save" onClick={this.onSubmit}>
            Lưu
          </Button>
        </div>
      </Wrapper>
    );
  }
}

export default DetailForm;
