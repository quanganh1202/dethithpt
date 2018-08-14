import React, { Component } from 'react';

class FacebookLogin extends Component {
  componentDidMount() {
    document.addEventListener('FBObjectReady', this.initializeFacebookLogin);
  }

  componentWillUnmount() {
    document.removeEventListener('FBObjectReady', this.initializeFacebookLogin);
  }

  // Init FB object and check Facebook Login status
  initializeFacebookLogin = () => {
    this.FB = window.FB;
    this.checkLoginStatus();
  }

  // Check login status
  checkLoginStatus = () => {
    this.FB.getLoginStatus(this.facebookLoginHandler);
  }

  // Check login status and call login api if user is not logged in
  facebookLogin = () => {
    console.log('there');
    if (!this.FB) return;
    console.log('here');
    this.FB.getLoginStatus((response) => {
      if (response.status === 'connected') {
        this.facebookLoginHandler(response);
      } else {
        this.FB.login(this.facebookLoginHandler, { scope: 'public_profile,email' });
      }
    }, );
  }

  // Handle login response
  facebookLoginHandler = response => {
    if (response.status === 'connected') {
      this.FB.api('/me', { locale: 'en_US', fields: 'email' }, (userData) => {
        this.props.onLogin({ email: userData.email });
      });
    } else {
      console.log('disconnected from the server');
    }
  }

  render() {
    let {children} = this.props;
    return (
      <div onClick={this.facebookLogin}>
        {children}
      </div>
    );
  }
}

export default FacebookLogin;