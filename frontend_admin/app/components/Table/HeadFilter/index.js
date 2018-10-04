import React from 'react';
import styled from 'styled-components';
import { Input } from 'reactstrap';

const Wrapper = styled.th`
  position: 'relative';
`;

class HeadFilter extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      open: false,
    }
    this.clickHandle = this.clickHandle.bind(this);
    this.clickOutsideHandle = this.clickOutsideHandle.bind(this);
  }

  componentWillUnmount() {
    document.getElementById('select-header').removeEventListener('click', this.clickOutsideHandle, false);
    document.removeEventListener('click', this.clickOutsideHandle, false);
  }

  clickHandle() {
    if (!this.state.open) {
      document.getElementById('select-header').addEventListener('click', this.clickOutsideHandle, false);
      document.addEventListener('click', this.clickOutsideHandle, false);
    } else {
      document.getElementById('select-header').removeEventListener('click', this.clickOutsideHandle, false);
      document.removeEventListener('click', this.clickOutsideHandle, false);
    }

    this.setState({
      open: !this.state.open,
    });
  }

  clickOutsideHandle(e) {
    if (this.node && this.node.contains(e.target)) {
      return;
    }
    this.clickHandle();
  }

  render() {
    return (
      <th
        style={{ position: 'relative', cursor: 'pointer' }}
        ref={(node) => { this.node = node }}
      >
        <span
          onClick={this.clickHandle}
          id="select-header"
        >{this.props.children}</span>
        <div
          style={{
            background: 'white',
            position: 'absolute',
            display: this.state.open ? 'block' : 'none',
            border: '1px solid black',
            zIndex: '1000000',
          }}>
          <Input
            type="select"
            name={this.props.selectName}
            id="multiple-select"
            multiple
            onChange={this.props.onSelect}
            defaultValue={this.props.value}
            style={{ width: 'auto', height: '60px' }}
          >
          {/* <select
            name={this.props.selectName}
            style={{ minWidth: '100px' }}
            multiple
            onChange={this.props.onSelect}
            defaultValue={this.props.value}
          > */}
            {this.props.options.map((i) => (
              <option key={i.value} value={i.value} title={i.label}>{i.label}</option>
            ))}
          {/* </select> */}
          </Input>
        </div>
      </th>
    );
  }
}

export default HeadFilter;
