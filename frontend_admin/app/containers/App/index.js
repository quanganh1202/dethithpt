/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route, withRouter } from 'react-router-dom';
import { getUser } from 'services/auth';
import DefaultLayout from 'containers/DefaultLayout';

// Styles
// CoreUI Icons Set
import '@coreui/icons/css/coreui-icons.min.css';
// Import Flag Icons Set
import 'flag-icon-css/css/flag-icon.min.css';
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
// Import Main styles for this application
import 'assets/scss/style.css';

import Login from 'containers/Login/Admin';

class App extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.loading = true;
  }
  componentWillMount() {
    // Facebook init
    window.fbAsyncInit = function () {
      FB.init({
        appId: '273274706807786', // FB app ID, TODO: need to be replaced using const
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v2.11',
        cookie: true,
        status: true,
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

    // Google init
    gapi.load('auth2', () => {
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      this.auth2 = window.gapi.auth2.init({
        client_id: '33146074840-tdm6djs1ckddpkqktn0k04nabjh0fpde.apps.googleusercontent.com', // TODO: need to replace using const
        cookiepolicy: 'single_host_origin',
      });
    });
  }

  render() {
    const user = getUser();
    const url = window.location.href;
    const arr = url.split("/");
    const result = arr[0] + "//" + arr[2];
    if (!user) {
      return <Login />
    }
    return (
      <div>
        <Helmet>
          <base href={`${result}/admin`} />
        </Helmet>
        <Switch>
          <Route path="/" name="Home" component={DefaultLayout} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
