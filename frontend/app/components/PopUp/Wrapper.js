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
  background-color: rgba(0, 0, 0, .80); 

  .popup-body {
    position: relative;
    box-shadow: -50px 0 200px -50px #504bff, 50px 0 200px -50px #4cfa63;
  }
  .popup-content {
    background-color: white;
    width: ${(props) => props.width || '750px'};
    z-index: 10;
    max-height: calc(100vh - 100px);
    overflow: auto;
  }
  .popup-close-btn {
    background-color: white;
    border-radius: 50%;
    position: absolute;
    top: -20px;
    right: -20px;
    color: #555555;
    z-index: 11;
    font-size: 40px;
    cursor: pointer;
    width: 40px;
    height: 40px;
    padding: 0;
    > * {
      vertical-align: top;
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