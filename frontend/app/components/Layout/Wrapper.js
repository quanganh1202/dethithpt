import styled from 'styled-components';

const Wrapper = styled.div`
  & .column {
    float: left;
    width: 45%;
    padding: 0 5px;
    &.lg-column {
      width: 65%;
    }
    &.md-column {
      width: 20%;
    }
    &.sm-column {
      width: 15%;
    }
    &:first-child {
      padding-left: 10px;
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
    }
    
  }
`;

export default Wrapper;
