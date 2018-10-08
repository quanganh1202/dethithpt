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
    margin-bottom: 5px;
    > span.document-icon {
      margin-right: 5px;
    }
    > span:nth-child(2) {
      color: #295496;
      font-weight: bold;
    }
    > span.document-action-icon{
      padding: 0 2px;
      border: 1px solid transparent;
      margin-left: 2px;
      cursor: pointer;
      &:hover {
        border: 1px solid #295496;
      }
      > .title-icon {
      color: orange;
      }
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
    font-size: 0.95em;
    overflow: auto;
    > .left-info {
      float: left;
      > p {
        margin: 15px 0 0;
        float: left;
        padding: 0 10px 0 5px;
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
