import React from 'react';
import styled from 'styled-components';
import avatarDefaultIcon from 'images/avatar_default.png';

const Wrapper = styled.div`
  min-height: 180px;
  text-align: center;
  > p {
    font-size: 0.9em;
    font-weight: bold;
    color: #DE7A12;
  }
  > p:last-child {
    color: #3F4ACC;
  }
  > img {
    width: 100px;
    height: 100px;
  }
`;

const UserBoard = (props) => {
  return (
    <Wrapper className="user-board">
      {props.user && (
        <React.Fragment>
          <p>{props.user.email}</p>
          <img src={props.user.avatar || avatarDefaultIcon} alt="avatar" />
          <p>Thay ảnh đại diện</p>
        </React.Fragment>
      )}
    </Wrapper>
  )
};

export default UserBoard;