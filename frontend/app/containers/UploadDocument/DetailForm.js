import React from 'react';
import styled from 'styled-components';
import { WithContext as ReactTags } from 'react-tag-input';
import { fromJS } from 'immutable';

import Button from './Button';

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

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

  .form-group {
    margin-bottom: 15px;

    .form-control {
      width: 70%;
    }
    input.form-control, textarea.form-control {
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 5px 10px;
    }
  }

  /*the container must be positioned relative:*/
  .custom-select {
    position: relative;
    font-family: Arial;
  }
  .custom-select select {
    display: none; /*hide original SELECT element:*/
  }
  .select-selected {
    background-color: DodgerBlue;
  }
  /*style the arrow inside the select element:*/
  .select-selected:after {
    position: absolute;
    content: "";
    top: 14px;
    right: 10px;
    width: 0;
    height: 0;
    border: 6px solid transparent;
    border-color: #fff transparent transparent transparent;
  }
  /*point the arrow upwards when the select box is open (active):*/
  .select-selected.select-arrow-active:after {
    border-color: transparent transparent #fff transparent;
    top: 7px;
  }
  /*style the items (options), including the selected item:*/
  .select-items div,.select-selected {
    color: #ffffff;
    padding: 8px 16px;
    border: 1px solid transparent;
    border-color: transparent transparent rgba(0, 0, 0, 0.1) transparent;
    cursor: pointer;
    border-radius: 4px;
  }
  /*style items (options):*/
  .select-items {
    position: absolute;
    background-color: DodgerBlue;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 99;
  }
  /*hide the items when the select box is closed:*/
  .select-hide {
    display: none;
  }
  .select-items div:hover, .same-as-selected {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

class DetailForm extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      formData: fromJS({
        name: this.props.name
      }),
      files: [],
      tags: [
        { id: "Thailand", text: "Thailand" },
        { id: "India", text: "India" }
      ],
      suggestions: [
          { id: 'USA', text: 'USA' },
          { id: 'Germany', text: 'Germany' },
          { id: 'Austria', text: 'Austria' },
          { id: 'Costa Rica', text: 'Costa Rica' },
          { id: 'Sri Lanka', text: 'Sri Lanka' },
          { id: 'Thailand', text: 'Thailand' }
      ]
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const self = this;
    var x, i, j, selElmnt, a, b, c;
    /*look for any elements with the class "custom-select":*/
    x = document.getElementsByClassName("custom-select");
    for (i = 0; i < x.length; i++) {
      selElmnt = x[i].getElementsByTagName("select")[0];
      /*for each element, create a new DIV that will act as the selected item:*/
      a = document.createElement("DIV");
      a.setAttribute("class", "select-selected");
      a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
      x[i].appendChild(a);
      /*for each element, create a new DIV that will contain the option list:*/
      b = document.createElement("DIV");
      b.setAttribute("class", "select-items select-hide");
      for (j = 1; j < selElmnt.length; j++) {
        /*for each option in the original select element,
        create a new DIV that will act as an option item:*/
        c = document.createElement("DIV");
        c.innerHTML = selElmnt.options[j].innerHTML;
        c.addEventListener("click", function(e) {
            /*when an item is clicked, update the original select box,
            and the selected item:*/
            var y, i, k, s, h;
            s = this.parentNode.parentNode.getElementsByTagName("select")[0];
            h = this.parentNode.previousSibling;
            for (i = 0; i < s.length; i++) {
              if (s.options[i].innerHTML == this.innerHTML) {
                s.selectedIndex = i;
                h.innerHTML = this.innerHTML;
                y = this.parentNode.getElementsByClassName("same-as-selected");
                for (k = 0; k < y.length; k++) {
                  y[k].removeAttribute("class");
                }
                this.setAttribute("class", "same-as-selected");
                break;
              }
            }
            const { name, value } = selElmnt;
            self.handleChange({ target: { name, value } });
            h.click();
        });
        b.appendChild(c);
      }
      x[i].appendChild(b);
      a.addEventListener("click", function(e) {
          /*when the select box is clicked, close any other select boxes,
          and open/close the current select box:*/
          e.stopPropagation();
          closeAllSelect(this);
          this.nextSibling.classList.toggle("select-hide");
          this.classList.toggle("select-arrow-active");
      });
    }
    function closeAllSelect(elmnt) {
      /*a function that will close all select boxes in the document,
      except the current select box:*/
      var x, y, i, arrNo = [];
      x = document.getElementsByClassName("select-items");
      y = document.getElementsByClassName("select-selected");
      for (i = 0; i < y.length; i++) {
        if (elmnt == y[i]) {
          arrNo.push(i)
        } else {
          y[i].classList.remove("select-arrow-active");
        }
      }
      for (i = 0; i < x.length; i++) {
        if (arrNo.indexOf(i)) {
          x[i].classList.add("select-hide");
        }
      }
    }
    /*if the user clicks anywhere outside the select box,
    then close all select boxes:*/
    document.addEventListener("click", closeAllSelect);
  }

  handleDelete(i) {
    const { tags } = this.state;
    this.setState({
    tags: tags.filter((tag, index) => index !== i),
    });
  }

  handleAddition(tag) {
    this.setState(state => ({ tags: [...state.tags, tag] }));
  }

  handleDrag(tag, currPos, newPos) {
    const tags = [...this.state.tags];
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    this.setState({ tags: newTags });
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

  onSubmit() {
    const { formData } = this.state;
    if (formData.get('name'))  this.props.onSubmit(this.state.formData.toJS());
  }

  render() {
    const { tags, suggestions, formData } = this.state;

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
          <label htmlFor="school">&nbsp;</label>
          <div className="custom-select form-control" style={{ display: 'grid' }}>
            <select name="school" onSelect={this.handleChange}>
              <option value="0">Select car:</option>
              <option value="1">Audi</option>
              <option value="2">BMW</option>
              <option value="3">Citroen</option>
              <option value="4">Ford</option>
              <option value="5">Honda</option>
              <option value="6">Jaguar</option>
              <option value="7">Land Rover</option>
              <option value="8">Mercedes</option>
              <option value="9">Mini</option>
              <option value="10">Nissan</option>
              <option value="11">Toyota</option>
              <option value="12">Volvo</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="name">Từ khóa <i className="required">(*)</i></label>
          <ReactTags tags={tags}
            suggestions={suggestions}
            handleDelete={this.handleDelete}
            handleAddition={this.handleAddition}
            handleDrag={this.handleDrag}
            delimiters={delimiters}
            inline
            className="form-control"
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
          <Button name="button-save" onClick={this.onSubmit}>Lưu</Button>
        </div>
      </Wrapper>
    );
  }
}

export default DetailForm;