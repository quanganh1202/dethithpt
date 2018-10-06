import styled from 'styled-components';

const HeaderBar = styled.div`
  height: 100px;
  background: #fff;
  > div {
    float: left;
  }

  & img {
    height: 70px;
    margin-top: 10px;
  }

  .header-search-box {
    > form {
      padding: 20px;
      position: relative;
      > input[type="text"] {
        width: 350px;
        padding: 10px 15px 10px 40px;
        border: 1px solid rgba(74, 80, 82, 0.29);
        border-radius: 5px 5px;
      }
      > button[type="submit"] {
        padding: 10px 15px;
        outline: none;
        position: absolute;
        height: 30px;
        width: 20px;
        background: url('https://cdn1.iconfinder.com/data/icons/hawcons/32/698627-icon-111-search-128.png');
        background-size: 100%;
        top: 25px;
        left: 25px;
      }
    }
  }

  /* 
    ##Device = Most of the Smartphones Mobiles (Portrait)
    ##Screen = B/w 320px to 479px
  */
  @media (min-width: 320px) and (max-width: 480px) {
    text-align: center;
    .header-search-box {
      display: none;
    }
  }
`;

export default HeaderBar;