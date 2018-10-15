/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import { compose } from 'redux';
import styled from 'styled-components';
import { Switch, Route, withRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import injectSaga from 'utils/injectSaga';

import HomePage from 'containers/HomePage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import UserInformation from 'containers/UserInformation/Loadable';
import DocumentTest from 'containers/DocumentTest/Loadable';
import Header from 'components/Header';
import Footer from 'components/Footer';
import { getUser } from 'services/auth';
import saga from './saga';

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
    return (
      <ThemeProvider theme={theme}>
        <AppWrapper>
          <Helmet
            titleTemplate="%s - Tailieudoc.vn"
            defaultTitle="Tailieudoc.vn"
          >
            <meta name="description" content="Tailieudoc.vn" />
          </Helmet>
          <Header push={this.props.history.push} user={user} />
          <Switch>
            <Route exact path="/404" component={NotFoundPage} />
            <Route exact path="/trang-ca-nhan" component={UserInformation} />
            <Route exact path="/tai-lieu/:id/thi-thu/:testId" component={DocumentTest} />
            <Route path="/" component={HomePage} />
          </Switch>
          {/* <Footer /> */}
        </AppWrapper>
      </ThemeProvider>
    );
  }
}

const withSaga = injectSaga({ key: 'global', saga });

export default compose(
  withSaga,
)(withRouter(App));
