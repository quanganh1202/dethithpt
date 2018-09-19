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
import { Switch, Route, withRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import HomePage from 'containers/HomePage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import UserInformation from 'containers/UserInformation/Loadable';
import Header from 'components/Header';
import Footer from 'components/Footer';
import { getUser } from 'services/auth';

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
    return (
      <ThemeProvider theme={theme}>
        <AppWrapper>
          <Helmet
            titleTemplate="%s - DethiTHPT"
            defaultTitle="DethiTHPT"
          >
            <meta name="description" content="DethiTHPT" />
          </Helmet>
          <Header push={this.props.history.push} user={user} />
          <Switch>
            <Route exact path="/404" component={NotFoundPage} />
            <Route exact path="/trang-ca-nhan" component={UserInformation} />
            <Route path="/" component={HomePage} />
          </Switch>
          {/* <Footer /> */}
        </AppWrapper>
      </ThemeProvider>
    );
  }
}

export default withRouter(App);
