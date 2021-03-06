import React from 'react';
import PropTypes from 'prop-types';

import Wrapper from './Wrapper';

function Layout(props) {
  let content = props.content.map(({ key = Math.random(), children }) => 
    <div key={key} className="column">{children}</div>
  );
  return (
    <Wrapper>
      {content}
    </Wrapper>
  );
}

Layout.propTypes = {
};

export default Layout;
