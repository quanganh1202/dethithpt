import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  background-color: white;
  display: flex;
  vertical-align: middle;
  > div:first-of-type {
    padding: 0;
  }
`;

const CustomSelect = (props) => {
  return (
    <Wrapper
      ref={props.innerRef}
      {...props.innerProps}
    >
      {props.children}
    </Wrapper>
  );
}

export default CustomSelect;
