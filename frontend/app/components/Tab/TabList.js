import React from 'react';

import { getRandomColor } from 'utils/helper';
// import folderOpen from 'images/folder_open.png';
import { LIST_COLOR } from 'utils/constants';

function TabList({ item, type }) {
  return (
    <li className={type === LIST_COLOR ? "list-color" : "list-folder"} style={{ borderColor: getRandomColor() }}>
      <a href="#">
        {type !== LIST_COLOR ? <img style={{ width: '15px' }} src={'folderOpen'} alt={`thư mục ${item.title}`} /> : null} {item.title}
      </a>
      <i className="list-quantity">{item.quantity}</i>
    </li>
  );
}

export default TabList;
