import styled from 'styled-components';

const UserDashboard = styled.div`
  &.user-dashboard {
    padding: 5px 10px;
    margin-bottom: 15px;
    a {
      text-decoration: none;
    }
    p {
      font-size: 0.8em;
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
      font-weight: bold;
    }
    & .user-page-link {
      margin-bottom: 10px;
      a {
        color: blue;
        font-weight: bold;
      }
    }
  }

  &.user-login {
    text-align: center;
    margin-bottom: 15px;
    .social-btn {
      padding: 5px 10px;
      width: 90%;
      margin: 0 auto 5px;
    }
  }

  .control-btns {
    margin-top: 10px;
  }

  /* 
    ##Device = Most of the Smartphones Mobiles (Portrait)
    ##Screen = B/w 320px to 479px
  */
  @media (min-width: 320px) and (max-width: 480px) {
    &.user-dashboard {
      display: none;
    }
    
  }
`;

export default UserDashboard;
