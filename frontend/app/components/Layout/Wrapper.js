import styled from 'styled-components';

const Wrapper = styled.div`
  & .column {
    float: left;
    width: 45%;
    padding: 0 5px;

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

  /* 
    ##Device = Most of the Smartphones Mobiles (Portrait)
    ##Screen = B/w 320px to 479px
  */
  @media (min-width: 320px) and (max-width: 480px) {
    & .column {
      width: 100% !important;
      &:nth-child(2) {
        width: 100%;
      }
    }
    
  }
`;

export default Wrapper;
