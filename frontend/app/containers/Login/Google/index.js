import React, { Component } from 'react';

class GoogleLogin extends Component {
	constructor() {
		super();
		this.state = {};
		this.googleLogin = this.googleLogin.bind(this);
	}

  componentDidMount() {
    gapi.load('auth2', () => {
      this.auth2 = window.gapi.auth2.getAuthInstance();
    });
  }

  googleLogin(data) {
    if (!this.auth2.isSignedIn.get()) {
			this.auth2.signIn().then((response) => {
				this.props.onLogin({ ggToken: response.getAuthResponse().id_token });
			});
		} else {
      const id_token = this.auth2.currentUser.get().getAuthResponse().id_token;
      this.props.onLogin({ ggToken: id_token });
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