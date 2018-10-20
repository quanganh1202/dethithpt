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
    .bm-item-list .mobile-nav-menu a {
      text-align: center;
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

  .mobile-user-dashboard {
    padding: 20px 30px 10px;
    > div {
      margin-bottom: 10px;
      > .social-btn {
        font-size: 0.9em;
        height: 30px;
        line-height: 30px;
      }
    }
    &.logged-in {
      color: white;
      a {
        text-decoration: none;
      }
      p {
        font-size: 0.9em;
        margin: 0;
        &.user-payment {
          text-align: left;
          .user-icon {
            margin-right: 5px;
          }
        }
      }
      text-align: center;
      & .user-email {
        color: orange;
      }
      & .user-page-link {
        margin-bottom: 10px;
        a {
          color: blue;
        }
      }
    }
  }

  .header-search-box.mobile {
    float: left;
    width: calc(100% - 44px);
    height: 44px;
    > form {
      position: relative;
      height: 100%;
      > input[type="text"] {
        width: 80%;
        padding: 5px 15px 5px 40px;
        margin: 7px 20px;
        border: 1px solid rgba(74, 80, 82, 0.29);
        border-radius: 5px 5px;
        background-color: white;
        vertical-align: middle;
      }
      > button[type="submit"] {
        padding: 10px 15px;
        outline: none;
        position: absolute;
        height: 30px;
        width: 20px;
        background: url('https://cdn1.iconfinder.com/data/icons/hawcons/32/698627-icon-111-search-128.png');
        background-size: 100%;
        top: 7px;
        left: 25px;
      }
    }
  }  
`;
