import styled from 'styled-components';

export default styled.div`
  text-align: left;
  background: #3c75a9;
  overflow: auto;

  /* 
    ##Device = Most of the Smartphones Mobiles (Portrait)
    ##Screen = B/w 320px to 479px
  */
  @media (min-width: 320px) and (max-width: 480px) {
    text-align: center;
    .bm-item-list a {
      display: inline-block;
      width: 100%;
    }
  }

  .mobile-search-box {
    float: left;
    height: 44px;
    width: 80%;
    padding: 7px 10px;
    > input {
      vertical-align: middle;
      background-color: white;
      border-radius: 4px;
      height: 30px;
      width: 100%;
      padding: 1px 10px;
    }
  }
  .mobile-menu-toggle {
    float: right;
    padding: 10px;
    color: white;
  }
  .mobile-burger-menu {
    background-color: #3c75a9;
    > .bm-item-list {
      hr {
        width: 90%;
        margin: 0 auto;
      }
    }
  }
  .bm-overlay,
  .bm-menu-wrap {
    top: 0;
  }
  .bm-burger-button {
    display: none;
  }
`;
