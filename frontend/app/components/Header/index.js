import React from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import MediaQuery from 'react-responsive';
import { Link } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faFolder, faCog } from '@fortawesome/free-solid-svg-icons';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { slide as Menu } from 'react-burger-menu';
import SocialButton from 'components/SocialButton';
import FacebookLogin from 'containers/Login/Facebook';
import GoogleLogin from 'containers/Login/Google';

import A from './A';
import NavBar from './NavBar';
import HeaderLink from './HeaderLink';
import Banner from './banner.png';
import messages from './messages';

library.add(faBars, faFolder, faCog, faFileAlt);

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

const PageLink = styled.div``;
const numberWithCommas = (x) => {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

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
    const { user } = this.props;
    console.log(user);
    return (
      <div>
        <HeaderBar>
          <A href="/">
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
            <Menu
              isOpen={this.state.mobileShow}
              menuClassName={'mobile-burger-menu'}
            > 
              {!this.props.user ?
                (<div className="mobile-user-dashboard">
                  <FacebookLogin onLogin={this.onLogin}>
                    <SocialButton
                      text={'Đăng nhập bằng facebook'}
                      background={'blue'}
                      className={'social-btn'}
                    />
                  </FacebookLogin>
                  <GoogleLogin onLogin={this.onLogin}>
                    <SocialButton
                      text={'Đăng nhập bằng google'}
                      background={'red'}
                      className={'social-btn'}
                    />
                  </GoogleLogin>
                </div>) : (
                  <div className="mobile-user-dashboard logged-in">
                    <p className="user-email">{user.email}</p>
                    <p className="user-page-link"><Link to="/">(Trang cá nhân)</Link></p>
                    <p className="user-payment">
                      <FontAwesomeIcon className="user-icon" icon={['far', 'file-alt']} />
                      Số dư : <span className="red bold">{numberWithCommas(50000)}</span>đ (HSD: <span className="green bold">5</span> ngày)
                    </p>
                    <p className="user-payment">
                      <FontAwesomeIcon className="user-icon" icon={['fas', 'folder']} />
                      Đã tải: <span className="bold">550</span> tài liệu (<Link to="/">Chi tiết</Link>)
                    </p>
                    <p className="user-payment">
                      <FontAwesomeIcon className="user-icon" icon={['fas', 'cog']} />
                      Đã đăng: <span className="bold">35</span> tài liệu (<Link to="/">Chi tiết</Link>)
                    </p>
                  </div>
                )
              }
              <PageLink className={'mobile-nav-menu'} onClick={() => this.setState({ mobileShow: false })}>
                <hr />
                <HeaderLink to="/">
                  <FormattedMessage {...messages.home} />
                </HeaderLink>
                <hr />
                <HeaderLink to="/dang-ban-tai-lieu">
                  Đăng bán tài liệu
                </HeaderLink>
              </PageLink>
            </Menu> 
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
