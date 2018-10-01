import styled from 'styled-components';

const Wrapper = styled.div`
  p, ul {
    margin: 0;
  }
  .grey-box > .content {
    padding: 0;
    min-height: 0;
    > .content-notification {
      padding: 5px 10px;
      background-color: white;
      border: 1px solid grey;
      text-align: right;
    }
    .content-docs {
      padding: 5px 10px;
      background-color: white;
      margin-bottom: 15px;
    }
  }
  
  .doc-details {
    .doc-title {
      text-align: center;
      font-size: 1.1em;
      font-weight: bold;
      color: blue;
      border-bottom: 1px dashed darkgrey;
      padding-bottom: 10px;
    }

    .doc-category {
      padding: 5px 0 10px;
      border-bottom: 1px dashed darkgrey;
      > ul {
        overflow: auto;
        padding-left: 0;
        width: 100%;
      }
      > ul > li {
        margin-bottom: 0;
        font-size: 0.8em;
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

    .doc-action {
      border-bottom: 1px dashed darkgrey;
      .btn-download, .btn-view {
        padding: 12px 10px;
        border-radius: 10px;
        color: white;
        margin: 10px 10px 10px 0;
      }
      .btn-download {
        background-color: orange;
      }
      .btn-view {
        position: relative;
        background-color: LightSeaGreen;
        img {
          display: none;
        }
      }
      .btn-view.loading {
        padding-top: 2px;
        padding-bottom: 0px;
        img {
          display: unset;
        }
      }
      .btn-report, .btn-favorite {
        padding: 3px 5px;
        color: white;
        font-size: 0.8em;
        font-weight: bold;
        border-radius: 5px;
        margin: 10px 5px 10px 0;
      }
      .btn-report {
        background-color: grey;
      }
      .btn-favorite {
        background-color: green;
      }
      p.created-date {
        font-weight: bold;
        float: right;
        font-size: 0.7em;
        color: darkgrey;
        margin: 10px 0 0;
      }
    }

    .doc-description {
      border-bottom: 1px dashed darkgrey;
      > p:first-child {
        padding: 10px 0 5px;
        font-weight: bold;
        font-size: 1em;
        color: grey;
      }
      > p:nth-child(2) {
        color: grey;
        font-size: 0.9em;
        margin-bottom: 5px;
      }
    }

    .doc-tags {
      padding: 10px 0 15px;
      overflow: auto;
      > p {
        float: left;
        padding: 5px 10px;
        &:first-child {
          font-weight: bold;
        }
        &.tag-item {
          margin-right: 10px;
          cursor: pointer;
          border-radius: 3px;
          background-color: lightgrey;
          &:hover {
            background-color: dimgrey;
            color: white;
          }
        }
      }
    }
  }

  .error-document {
    display: none;
    &.show {
      display: block;
      height: 30px;
      line-height: 30px;
      color: white;
      background-color: red;
      font-size: 0.9em;
      padding: 0 10px;
      margin-bottom: 10px;
    }
  }
  .document-title {
    text-align: left;
    font-size: 0.9em;
    font-weight: bold;
    padding: 5px 10px;
    color: #3f48cc;
    background-color: #E5E5E5;
    > span.bold {
      color: black;
    }
  }
`;

export default Wrapper;
