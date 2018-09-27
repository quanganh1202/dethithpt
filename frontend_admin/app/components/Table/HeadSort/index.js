import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';

library.add(faSort, faSortUp, faSortDown);

const HeadSort = ({
  children,
  sortBy,
  sortField,
  ...rest,
}) => {
  const arrow = sortBy === 'desc' ? 'down' : 'up';
  return (
    <th className="sort-column" {...rest}>
      {children}
      <span style={{ paddingLeft: '5px' }}>
        {
          sortField !== rest['data-field'] ? (
            <FontAwesomeIcon icon={['fas', 'sort']} />
          ) : (
            <FontAwesomeIcon icon={['fas', `sort-${arrow}`]} />
          )
        }
      </span>
    </th>
  )
}

export default HeadSort;
