/**
 *
 * UploadDocument
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';

import Tab from 'components/Tab';
import UploadPost from './UploadPost';
import Button from './Button';
import ErrorMessage from './ErrorMessage';

const Wrapper = styled.div`
  & .continue-button, & div.input-button {
    margin: 0 auto;
    margin-top: 20px;
  }

  & .dropzone > div {
    border: none!important;
    width: 100%!important;
    text-align: center;
    color: #555555;
  }

  & .list-item-upload {
    list-style: none;
    padding: 0;

    li {
      background: #f0f0f0;
      padding: 10px;
    }
  }
`;

/* eslint-disable react/prefer-stateless-function */
export class UploadDocument extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      stepDefinitions: [
        { id: "step1", title: "", component: () => <div>
          <label>Nội quy:</label>
          <div style={{ width: '100%', height: '200px' }}></div>
          <label>
            <input
              type="checkbox"
              style={{ marginRight: '5px' }}
              onChange={(e) => this.setState({
                confirm: e.target.checked
              })}
              required
              id="confirm-policy"
            />
            Tôi hoàn toàn đồng ý với các điều khoản của website
          </label>
          {this.state.error ? <ErrorMessage>{this.state.error}</ErrorMessage> : null}
          <Button onClick={() => this.nextStep('step2')} className="continue-button">Tiếp</Button>
        </div> },
        { id: "step2", title: "", component: () => (
          <UploadPost />
        )},
      ]
    };
  }

  nextStep(step) {
    if (step !== 'step2' || (step === 'step2' && this.state.confirm)) {
      let i;
      const x = document.getElementsByClassName("tab-content");
      for (i = 0; i < x.length; i++) {
          x[i].style.display = "none"; 
      }
      document.getElementById(step).style.display = "block"; 
    } else {
      this.setState({
        error: 'Bạn cần đồng ý với điều khoản của website',
      });
    }
  }

  render() {
    const { stepDefinitions } = this.state;

    const content = stepDefinitions.map((item, key) => {
      const Component = item.component;
      return <div
        className="tab-content"
        id={item.id}
        key={`tab-content-${key}`}
        style={{ display: key === 0 ? '' : 'none' }}
        >
        <Component />
      </div>;
    });
    return (
      <Wrapper>
        <Helmet>
          <title>UploadDocument</title>
          <meta name="description" content="Description of UploadDocument" />
        </Helmet>
        
        <Tab key="dang-ban-tai-lieu" style={{ background: 'white' }} title="Đăng tài liệu" content={
          <div style={{ padding: "20px" }}>
            {content}
          </div>
        } />
      </Wrapper> 
    );
  }
}

UploadDocument.propTypes = {
};

export default UploadDocument;
