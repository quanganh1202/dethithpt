import React from 'react';

import Wrapper from './Wrapper';

function Tab(props) {
  return (
    <Wrapper className={props.className} style={props.style}>
      {props.customTitle
        ? props.customTitle
        : <h2 className="title">{props.title}</h2>}
      <div className="content">
        {props.content}
      </div>
    </Wrapper>
  );
}

export default Tab;
