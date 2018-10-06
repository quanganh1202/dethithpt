import styled from 'styled-components';

const Wrapper = styled.div`
  p, ul {
    margin: 0;
  }

  .doc-filters {
    .content {
      min-height: 0;
      display: -webkit-flex; /* Safari */
      display: flex;
    }
    .doc-filter {
      -webkit-flex: 1;  /* Safari 6.1+ */
      -ms-flex: 1;  /* IE 10 */    
      flex: 1;
      margin: 0 10px;
    }
  }

  .grey-box > .content {
    padding: 0;
    min-height: 0;
  }
  /* 
    ##Device = Most of the Smartphones Mobiles (Portrait)
    ##Screen = B/w 320px to 479px
  */
  @media (min-width: 320px) and (max-width: 480px) {
    .doc-filters {
      .content {
        min-height: 0;
        display: block;
      }
      .doc-filter {
        width: 95%;
        margin-bottom: 5px;
      }
    }
  }
`;

export default Wrapper;
