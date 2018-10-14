import React from 'react';
import { Link } from 'react-router-dom';

import { getRandomColor } from 'utils/helper';
import folderOpen from 'images/folder_open.png';
import { LIST_COLOR } from 'utils/constants';

function TabList({ item, type }) {
  return (
    <li className={type === LIST_COLOR ? "list-color" : "list-folder"} style={{ borderColor: getRandomColor() }}>
      <Link to={item.link} className={item.active ? 'active-link' : ''}>
        {type !== LIST_COLOR ? <img style={{ width: '15px' }} src={folderOpen} alt={`thư mục ${item.title}`} /> : null} {item.title}
      </Link>
      {item.hasOwnProperty('quantity') && <i className="list-quantity">{item.quantity}</i>}
      {item.hasOwnProperty('priority') && item.priority !== 0 && <i> <span className="red bold">HOT</span></i>}
    </li>
  );
}

export default TabList;
