import React from 'react';

import Wrapper from './Wrapper';

function Tab(props) {
  return (
    <Wrapper className={props.className} style={props.style}>
      <div>{props.customTitle
        ? props.customTitle
        : <h2 className="title">{props.title}</h2>}
      </div>
      <div className="content">
        {props.content}
      </div>
    </Wrapper>
  );
}

export default Tab;
