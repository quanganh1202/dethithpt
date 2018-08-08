import React from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import A from './A';
import NavBar from './NavBar';
import HeaderLink from './HeaderLink';
import Banner from './banner.jpg';
import messages from './messages';

const HeaderBar = styled.div`
  height: 100px;
  background: #fff;

  & img {
    width: 300px;
  }
`;

/* eslint-disable react/prefer-stateless-function */
class Header extends React.Component {
  render() {
    return (
      <div>
        <HeaderBar>
          <A href="https://twitter.com/mxstbr">
            <img src={Banner} alt="DethiTHPT" />
          </A>
        </HeaderBar>
        <NavBar>
          <HeaderLink to="/">
            <FormattedMessage {...messages.home} />
          </HeaderLink>
          <HeaderLink to="/dang-ban-tai-lieu">
            Đăng bán tài liệu
          </HeaderLink>
        </NavBar>
      </div>
    );
  }
}

export default Header;
