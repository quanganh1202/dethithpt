/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';
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

const AppWrapper = styled.div`
  margin: 0 auto;
  display: flex;
  min-height: 100%;
  flex-direction: column;
`;

const theme = {
  headerMenu: '#6668a9',
  linkColor: '#295496',
};

class App extends React.Component {
  componentDidMount() {
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
  }

  render() {
    const user = getUser();
    const url = window.location.href;
    const arr = url.split("/");
    const result = arr[0] + "//" + arr[2];
    console.log(1);
    return user ? (
      <div>
        <Helmet>
          <base href={`${result}/admin`} />
        </Helmet>
        <Switch>
          <Route path="/" name="Home" component={DefaultLayout} />
        </Switch>
      </div>
    ) : 
    null
    // window.location.replace(result);
  }
}

export default App;
