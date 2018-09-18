import styled from 'styled-components';

const GreyTitle = styled.h2`
  font-size: 0.9em;
  padding: 5px 10px;
  margin: 0;
  color: #fff;
  background: #BFB8B8;
  overflow: auto;
  > p {
    margin: 0;
  }
  > p:first-child {
    float: left;
    color: black;
  }
  > p:nth-child(2) {
    float: right;
    font-size: 0.9em;
    color: white;
    font-weight: normal;
  }
`
export default GreyTitle;
