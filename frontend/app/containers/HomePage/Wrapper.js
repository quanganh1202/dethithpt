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
`;

export default HomeWrapper;
