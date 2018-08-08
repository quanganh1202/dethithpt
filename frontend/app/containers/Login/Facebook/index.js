import React, { Component } from 'react';

class FacebookLogin extends Component {
  componentDidMount() {
    // Facebook init
    window.fbAsyncInit = function () {
      FB.init({
        appId: '273274706807786', // FB app ID, TODO: need to be replaced using const
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v2.11'
      });

      // Broadcast an event when FB object is ready
      var fbInitEvent = new Event('FBObjectReady');
      document.dispatchEvent(fbInitEvent);
    };

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

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
    if (!this.FB) return;
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