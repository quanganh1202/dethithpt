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
    > .popup-close-btn {
      background-color: blue;
      position: absolute;
      top: 0;
      right: 0;
      color: red;
      z-index: 11;
    }
  }
  /* 
    ##Device = Most of the Smartphones Mobiles (Portrait)
    ##Screen = B/w 320px to 479px
  */
  @media (min-width: 320px) and (max-width: 480px) {
    > .popup-content {
      width: 100%;
    }
  }
`;

export default Wrapper;