import styled from 'styled-components';

const Wrapper = styled.div`
  padding: 15px;
  .doc-preview, .doc-answear-sheet {
    float: left;
  }
  .doc-preview {
    width: 70%;
  }
  .doc-answear-sheet {
    width: 30%;
    border: 1px solid #ccc;
    padding: 0 10px;
    .answear-countdown {
      overflow: auto;
      border-bottom: 1px solid #ccc;
      padding-bottom: 20px;
      .time-countdown {
        float: left;
        vertical-align: middle;
        line-height: 37px;
        color: #25ae6c;
        font-size: 2em;
        font-weight: bold;
        .title-icon {
          color: black;
          margin-right: 10px;
          font-size: 0.6em;
        }
      }
      .submit-answear-btn {
        float: right;
        padding-left: 14px;
        padding-right: 14px;
      }
    }
    .answear-section {
      > p {
        color: #25ae6c;
        font-weight: bold;
        font-size: 0.8em;
        border-bottom: 1px solid #ccc;
        padding-bottom: 10px;
        > span.bold {
          color: black;;
        }
        > span.answear-percent {
          font-size: 1.3em;
        }
      }
      .final-result {
        border-bottom: 1px solid #ccc;
        padding: 10px 0;
        .icon-meaning {
          margin-bottom: 5px;
        }
      }
    }
    .answear-line {
      margin: 10px 0;
    }
    .answear-item {
      border: 1px solid #337ab7;
      border-radius: 50%;
      width: 25px;
      height: 25px;
      padding: 0;
      color: #337ab7;
      margin-left: 20px;
      cursor: pointer;
      &.checked {
        color: white;
        background-color: #337ab7;
        &.failed {
          background-color: #cc0000;
          border: 1px solid #cc0000;
        }
        &.passed {
          background-color: #2bb774;
          border: 1px solid #2bb774;
        }
      }
    }
  }
`;

export default Wrapper;
