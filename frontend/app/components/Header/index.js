import React from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import MediaQuery from 'react-responsive';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons'

import A from './A';
import NavBar from './NavBar';
import HeaderLink from './HeaderLink';
import Banner from './banner.png';
import messages from './messages';

library.add(faBars);

const HeaderBar = styled.div`
  height: 100px;
  background: #fff;

  & img {
    height: 70px;
    margin-top: 10px;
  }

  /* 
    ##Device = Most of the Smartphones Mobiles (Portrait)
    ##Screen = B/w 320px to 479px
  */
  @media (min-width: 320px) and (max-width: 480px) {
    text-align: center;
  }
`;

/* eslint-disable react/prefer-stateless-function */
class Header extends React.Component {
  constructor() {
    super();
    this.state = {
      mobileShow: false,
    }
    this.showMenu = this.showMenu.bind(this);
  }
  showSettings(e) {
    e.preventDefault();
  }
  showMenu() {
    this.setState({ mobileShow: true });
  }
  render() {
    return (
      <div>
        <HeaderBar>
          <A href="https://twitter.com/mxstbr">
            <img src={Banner} alt="DethiTHPT" />
          </A>
        </HeaderBar>
        <NavBar>
          <MediaQuery minDeviceWidth={320} maxDeviceWidth={480}>
            <div className="mobile-search-box">
              <input type="search" />
            </div>
            <div className="mobile-menu-toggle">
              <FontAwesomeIcon onClick={this.showMenu} className="user-icon" icon={['fas', 'bars']} size="lg" />
            </div>            
          </MediaQuery>
          <MediaQuery minDeviceWidth={480}>
            <HeaderLink to="/">
              <FormattedMessage {...messages.home} />
            </HeaderLink>
            <HeaderLink to="/dang-ban-tai-lieu">
              Đăng bán tài liệu
            </HeaderLink>
          </MediaQuery>
        </NavBar>
      </div>
    );
  }
}

export default Header;
