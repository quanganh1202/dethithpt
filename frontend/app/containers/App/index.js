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
import { ThemeProvider } from 'styled-components';

import HomePage from 'containers/HomePage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import Header from 'components/Header';
import Footer from 'components/Footer';
import FacebookLogin from 'containers/Login/Facebook';
import GoogleLogin from 'containers/Login/Google';

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
  constructor() {
    super();
    this.state = {
      user: null,
    };
    this.onLogin = this.onLogin.bind(this);
  }

  onLogin(data) {
    this.setState({ user: data });
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <AppWrapper>
          <Helmet
            titleTemplate="%s - DethiTHPT"
            defaultTitle="DethiTHPT"
          >
            <meta name="description" content="DethiTHPT" />
          </Helmet>
          {!this.state.user ? (
            <div>
              <FacebookLogin onLogin={this.onLogin}>Login Facebook</FacebookLogin>
              <GoogleLogin onLogin={this.onLogin}>Login Google</GoogleLogin>
            </div>
          ) : (
            this.state.user.email || this.state.user.phone
          )}
          <Header />
          <Switch>
            <Route path="/" component={HomePage} />
          {/* <Route path="" component={NotFoundPage} /> */}
          </Switch>
          <Footer />
        </AppWrapper>
      </ThemeProvider>
    );
  }
}

export default App;
