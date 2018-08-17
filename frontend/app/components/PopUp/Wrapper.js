import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9;
  display: ${(props) => props.show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  > .popup-content {
    position: relative;
    background-color: white;
    width: 750px;
    z-index: 10;
    border: 2px solid black;
    max-height: calc(100vh - 20px);
    overflow: auto;
    > .close-btn {
      position: absolute;
      top: -20px;
      right: -20px;
    }
  }
`;

export default Wrapper;