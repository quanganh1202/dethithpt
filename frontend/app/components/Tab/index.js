import React from 'react';

import Wrapper from './Wrapper';
import List from '../List';

function Tab(props) {
  return (
    <Wrapper>
      <h2 className="title">{props.title}</h2>
      <div>{<List items={props.items} component={({ item }) => <li><a>{item.title}</a></li>} />}</div>
    </Wrapper>
  );
}
export default Tab;
