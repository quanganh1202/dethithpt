import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  ul {
    list-style: none;
    color: #838383;
    padding: 0;
    li {
      font-size: 0.9em;
      cursor: pointer;
      border-radius: 4px;
      padding: 10px 0 10px 70px;
      background-color: white;
      margin-bottom: 5px;
      &.active, &:hover {
        background-color: #00A888;
        color: white;
      }
      position: relative;
      > span {
        position: absolute;
        left: 35px;
      }
    }
  }
`;

const SideNav = (props) => {
  const renderListItems = (items) => {
    return items.map((i, idx) => (
      <li className={`side-nav-item ${props.currentTab === (i.tab || idx) && 'active'}`} key={i.tab || idx} onClick={() => props.onClick(i.tab || idx)}>
        <span>{i.icon || null}</span>
        {i.text}
      </li>
    ))
  }
  return (
    <Wrapper className="side-nav-menu">
      <ul className="side-nav-list">
        {renderListItems(props.items)}
      </ul>
    </Wrapper>
  );
};

export default SideNav;
