import React, { Component } from 'react';

class GoogleLogin extends Component {
	constructor() {
		super();
		this.state = {};
		this.googleLogin = this.googleLogin.bind(this);
	}

  componentDidMount() {
    gapi.load('auth2', () => {
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      this.auth2 = window.gapi.auth2.init({
        client_id: '33146074840-tdm6djs1ckddpkqktn0k04nabjh0fpde.apps.googleusercontent.com', // TODO: need to replace using const
        cookiepolicy: 'single_host_origin',
      });
    });
  }

  googleLogin(data) {
    if (!this.auth2.isSignedIn.get()) {
			this.auth2.signIn().then((response) => {
        console.log(response);
				this.props.onLogin({ email: response.getBasicProfile().getEmail() });
			});
		}
  }

  render() {
    let {children} = this.props;
    return (
      <div onClick={this.googleLogin}>
        {children}
      </div>
    );
  }
}

export default GoogleLogin;