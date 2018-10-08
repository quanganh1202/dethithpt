import styled from 'styled-components';

const HomeWrapper = styled.div`
  .grey-box > .content {
    padding: 0;
    min-height: 0;
    > .content-notification {
      padding: 5px 10px;
      background-color: white;
      border: 1px solid lightgrey;
      text-align: right;
    }
    .content-docs {
      padding: 5px 10px;
      background-color: white;
      margin-bottom: 15px;
    }
  }
  & .data-loading {
    text-align: center;
    color: green;
  }
  .document-title {
    text-align: left;
    font-size: 0.9em;
    font-weight: bold;
    padding: 5px 10px;
    color: #3f48cc;
    background-color: #e5e5e5;
    > span.bold {
      color: black;
    }
  }
  .popup-content {
    min-width: 100px;
    min-height: 100px;
  }
`;

export default HomeWrapper;
