import styled from 'styled-components';

const Wrapper = styled.div`
  margin-top: 10px;

  .rdw-editor-main {
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 2px;
    padding: 0 10px;
  }

  .rdw-editor-toolbar {
    border: 1px solid #ccc;
  }

  .form-group:after {
    clear: both;
    display: table;
    content: ' ';
  }

  .form-group {
    margin-bottom: 15px;

    .form-control {
      width: 70%;
      float: left;
    }

    input.form-control,
    textarea.form-control,
    .form-tags {
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 5px 10px;
      width: 100%;
      margin-bottom: 5px;
    }

    select {
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 4px 10px;
      display: block;
      min-width: 200px;
      margin-bottom: 5px;
    }

    .rct-select-input {
      margin-bottom: 5px;
    }

    .form-tags {
      .react-tagsinput-tag {
        border-radius: 2px;
        border: 1px solid #00a884;
        color: #00a884;
        display: inline-block;
        font-family: sans-serif;
        margin-right: 5px;
        padding: 1px 5px;

        .react-tagsinput-remove {
          color: #00a884;
        }
      }

      .react-tagsinput-remove {
        cursor: pointer;
        font-weight: bold;
      }

      .react-tagsinput-tag a::before {
        content: ' x';
      }
    }
  }
`;

export default Wrapper;
