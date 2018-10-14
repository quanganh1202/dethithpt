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
import HeaderBar from './HeaderBar';
import NavBar from './NavBar';
import HeaderLink from './HeaderLink';
import Banner from './banner.png';
import messages from './messages';

library.add(faBars, faFolder, faCog, faFileAlt);

const PageLink = styled.div``;
const numberWithCommas = x => {
  const parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

/* eslint-disable react/prefer-stateless-function */
class Header extends React.Component {
  constructor() {
    super();
    this.state = {
      mobileShow: false,
      textSearch: '',
    };
    this.showMenu = this.showMenu.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeSearch = this.onChangeSearch.bind(this);
  }
  showSettings(e) {
    e.preventDefault();
  }
  showMenu() {
    this.setState({ mobileShow: true });
  }
  onChangeSearch(e) {
    this.setState({
      textSearch: e.currentTarget.value,
    });
  }
  onSubmit(e) {
    e.preventDefault();
    this.props.push(`/tim-kiem?q=${this.state.textSearch}`);
    // this.setState({ textSearch: '' });
  }
  render() {
    const { user } = this.props;
    return (
      <div>
        <HeaderBar>
          <div>
            <A href="/">
              <img src={Banner} alt="Tailieudoc.vn" />
            </A>
          </div>
          <div className="header-search-box">
            <form id="search-form" onSubmit={this.onSubmit}>
              <input
                className="search-input"
                placeholder="Tìm kiếm tài liệu......."
                type="text"
                onChange={this.onChangeSearch}
                value={this.state.textSearch}
              />
              <button className="search-btn" type="submit" />
            </form>
          </div>
        </HeaderBar>
        <NavBar>
          <MediaQuery minDeviceWidth={320} maxDeviceWidth={480}>
            <div className="header-search-box mobile">
              <form id="search-form" onSubmit={this.onSubmit}>
                <input
                  className="search-input"
                  placeholder="Tìm kiếm tài liệu......."
                  type="text"
                  onChange={this.onChangeSearch}
                  value={this.state.textSearch}
                />
                <button className="search-btn" type="submit" />
              </form>
            </div>
            <div className="mobile-menu-toggle">
              <FontAwesomeIcon
                onClick={this.showMenu}
                className="user-icon"
                icon={['fas', 'bars']}
                size="lg"
              />
            </div>
            <Menu
              isOpen={this.state.mobileShow}
              menuClassName="mobile-burger-menu"
            >
              {!this.props.user ? (
                <div className="mobile-user-dashboard">
                  <FacebookLogin onLogin={this.onLogin}>
                    <SocialButton
                      text="Đăng nhập bằng facebook"
                      background="blue"
                      className="social-btn"
                    />
                  </FacebookLogin>
                  <GoogleLogin onLogin={this.onLogin}>
                    <SocialButton
                      text="Đăng nhập bằng google"
                      background="red"
                      className="social-btn"
                    />
                  </GoogleLogin>
                </div>
              ) : (
                <div className="mobile-user-dashboard logged-in">
                  <p className="user-email">{user.email}</p>
                  <p className="user-page-link">
                    <Link to="/trang-ca-nhan">(Trang cá nhân)</Link>
                  </p>
                  <p className="user-payment">
                    <FontAwesomeIcon
                      className="user-icon"
                      icon={['far', 'file-alt']}
                    />
                    Số dư :{' '}
                    <span className="red bold">{numberWithCommas(50000)}</span>đ
                    (HSD: <span className="green bold">5</span> ngày)
                  </p>
                  <p className="user-payment">
                    <FontAwesomeIcon
                      className="user-icon"
                      icon={['fas', 'folder']}
                    />
                    Đã tải: <span className="bold">550</span> tài liệu (<Link to="/">
                      Chi tiết
                    </Link>)
                  </p>
                  <p className="user-payment">
                    <FontAwesomeIcon
                      className="user-icon"
                      icon={['fas', 'cog']}
                    />
                    Đã đăng: <span className="bold">35</span> tài liệu (<Link to="/">
                      Chi tiết
                    </Link>)
                  </p>
                </div>
              )}
              <PageLink
                className="mobile-nav-menu"
                onClick={() => this.setState({ mobileShow: false })}
              >
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
            <HeaderLink to="/dang-ban-tai-lieu">Đăng bán tài liệu</HeaderLink>
          </MediaQuery>
        </NavBar>
      </div>
    );
  }
}

export default Header;
