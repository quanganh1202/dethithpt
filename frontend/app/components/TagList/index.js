import React from 'react';
import PropTypes from 'prop-types';

import Wrapper from './Wrapper';

function TagList(props) {
  return (
    <Wrapper>
      {props.items.map((item, idx) => (
        <button
          key={`item-${item.id}`}
          type="button"
          onClick={() => props.handleClickItem(item.tag, idx)}
          style={{
            backgroundColor:
              props.selectedTag === item.tag ? 'rgb(119, 119, 119)' : '#e6e6e6',
          }}
        >
          #{item.tag}
        </button>
      ))}
    </Wrapper>
  );
}

TagList.propTypes = {
  items: PropTypes.array,
  selectedTag: PropTypes.any,
};

export default TagList;
