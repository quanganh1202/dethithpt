import styled from 'styled-components';

const Wrapper = styled.div`
  & .column {
    float: left;
    width: 45%;
    padding-right: 15px;

    :first-child, :nth-child(3) {
      width: 20%;
    }
    :nth-child(4) {
      width: 15%;
    }
  }

  /* Clear floats after the columns */
  &:after {
    content: "";
    display: table;
    clear: both;
  }

  & .widget {

  }
`;

export default Wrapper;
