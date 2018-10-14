import styled from 'styled-components';

const Wrapper = styled.li`
  width: 100%;
  align-items: center;
  position: relative;
  background-color: white;
  padding: 5px 15px !important;
  margin-bottom: 15px !important;
  border-radius: 3px;

  &:first-child {
    border-top: none;
  }

  .doc-title {
    > span:first-child {
      color: #295496;
      font-weight: bold;
    }
    > .title-icon {
      margin-left: 5px;
      color: orange;
    }
  }

  .doc-category {
    > ul {
      overflow: auto;
      padding-left: 0;
      width: 100%;
    }
    > ul > li {
      font-size: 0.9em;
      float: left;
      padding: 0 5px;
      border-right: 1px solid black;
      list-style: none;
      color: red;
      &:first-child {
        padding-left: 0;
      }
      &:last-child {
        border-right: none;
      }
      > .specific-icon {
        margin-right: 5px;
        color: black;
      }
    }
  }

  .doc-information {
    font-size: 0.8em;
    overflow: auto;
    > .left-info {
      float: left;
      > p {
        margin: 15px 0 0;
        float: left;
        padding: 0 5px;
        &:first-child {
          padding-left: 0;
        }
        .info-icon {
          margin-right: 5px;
        }
      }
    }
    > .right-info {
      > p {
        margin: 15px 0 0;
        > .info-icon {
          margin-right: 5px;
        }
      }
      float: right;
    }
  }
`;

export default Wrapper;
