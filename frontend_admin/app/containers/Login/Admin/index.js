import React, { Component } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { Button, Card, CardBody, CardGroup, Col, Container, Row, Alert } from 'reactstrap';
import FacebookLogin from 'containers/Login/Facebook';
import GoogleLogin from 'containers/Login/Google';
import reducer from './reducer';
import saga from './saga';
import { login, clearMessage } from './actions';
import { makeSelectMessage } from './selectors';

class Login extends Component {
  constructor() {
    super();
    this.state = {};
    this.onLogin = this.onLogin.bind(this);
  }
  onLogin(data) {
    this.props.onLogin(data);
  }
  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="4">
              <CardGroup>
                <Card className="p-4">
                  <CardBody style={{ textAlign: 'center' }}>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <Alert color="danger" isOpen={!!this.props.message} toggle={this.props.clearMessage}>
                      {this.props.message}
                    </Alert>
                    <FacebookLogin onLogin={this.onLogin}>
                      <Button size="sm" className="btn-facebook btn-brand mr-1 mb-1">
                        <i className="fa fa-facebook"></i><span>Facebook</span>
                      </Button>
                    </FacebookLogin>
                    <GoogleLogin onLogin={this.onLogin}>
                      <Button size="sm" className="btn-google-plus btn-brand mr-1 mb-1">
                        <i className="fa fa-google-plus"></i><span>Google+</span>
                      </Button>
                    </GoogleLogin>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

Login.propTypes = {
};

export function mapDispatchToProps(dispatch) {
  return {
    onLogin: (payload) => dispatch(login(payload)),
    clearMessage: () => dispatch(clearMessage()),
  };
}

const mapStateToProps = createStructuredSelector({
  message: makeSelectMessage(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'login', reducer });
const withSaga = injectSaga({ key: 'login', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(Login);