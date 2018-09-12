import styled from 'styled-components';

const Wrapper = styled.div`
  .form-header {
    background-color: red;
    color: white;
    text-align: center;
    font-weight: bold;
    font-size: 1.1em;
    line-height: 40px;
    padding: 0 10px;
  }

  .form-body {
    padding: 15px;
    .form-error {
      color: white;
      background-color: red;
      font-size: 0.9em;
      text-align: center;
    }
    .form-body-note {
      color: blue;
      font-weight: bold;
      font-size: 1em;
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
        font-size: 0.8em;
        text-align: right;
        height: 40px;
        width: 30%;
      }
      tr > td > input,
      tr > td > select,
      .react-datepicker-wrapper > div > input {
        font-size: 0.8em;
        border: 1px solid #ccc;
        margin-left: 10px;
        width: 60%;
        height: 30px;
        padding: 0 5px;
      }
      .bod-picker {
        border: 1px solid #ccc;
      }
      div.react-datepicker-wrapper {
        width: 100%;
        > div {
          width: 100%;
        }
      }
      .control-btn {
        text-align: center;
        .submit-btn {
          cursor: pointer;
          margin: 15px auto 0;
          padding: 15px 50px;
          background-color: sandybrown;
          color: white;
          border-radius: 10px;
        }
      }
    }
  }
  /* 
    ##Device = Most of the Smartphones Mobiles (Portrait)
    ##Screen = B/w 320px to 479px
  */
  @media (min-width: 320px) and (max-width: 480px) {
    .form-body {
      form {
        input, select {
          width: 90%;
        }
      }
      .form-body-note {
        font-size: 0.9em;
      }
    }
    .form-header {
      font-size: 1em;
    }
  }
`;

export default Wrapper;