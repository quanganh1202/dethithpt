import styled from 'styled-components';

const Wrapper = styled.div`
  .form-header {
    background-color: red;
    color: white;
    text-align: center;
    font-weight: bold;
    font-size: 1.2em;
    line-height: 40px;
  }

  .form-body {
    padding: 15px;
    .form-body-note {
      color: blue;
      font-weight: bold;
      font-size: 1.1em;
      text-align: center;
      margin: 0;
    }
    form {
      margin: 20px 0;
      table {
        width: 100%;
      }
      tr > td:first-child {
        font-weight: bold;
        font-size: 0.9em;
        text-align: right;
        height: 40px;
        width: 30%;
      }
      input, select {
        border: 1px solid black;
        margin-left: 10px;
        width: 60%;
        height: 30px;
        padding: 0 5px;
      }
      .control-btn {
        text-align: center;
        .submit-btn {
          margin: 15px auto 0;
          padding: 15px 50px;
          background-color: orange;
          color: white;
          border-radius: 10px;
        }
      }
    }
  }
`;

export default Wrapper;