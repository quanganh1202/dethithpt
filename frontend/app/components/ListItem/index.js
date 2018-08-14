import React from 'react';
import PropTypes from 'prop-types';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faDollarSign, faEye as fasEye } from '@fortawesome/free-solid-svg-icons';
import { faEye, faFolderOpen, faFileAlt, faClock } from '@fortawesome/free-regular-svg-icons';
import Wrapper from './Wrapper';

library.add(faEye, faDownload, faFolderOpen, faFileAlt, faDollarSign, fasEye, faClock);

const numberWithCommas = (x) => {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

function ListItem(props) {
  return (
    <Wrapper>
      <div className="doc-title">
        <span>{props.item.title}</span>
        <FontAwesomeIcon className={'title-icon'} icon={['far', 'eye']} />
        <FontAwesomeIcon className={'title-icon'} icon={['fas', 'download']} />
      </div>
      <div className="doc-category">
        <ul>
          <li>{props.item.category}</li>
          <li>{props.item.subject}</li>
          <li>{props.item.class}</li>
          <li>{props.item.year}</li>
          <li>
            <FontAwesomeIcon className={'specific-icon'} icon={['far', 'folder-open']} />
            {props.item.specific}
          </li>
        </ul>
      </div>
      <div className="doc-information">
        <div className="left-info">
          <p>
            <FontAwesomeIcon className={'info-icon'} icon={['far', 'file-alt']} />
            {props.item.pages} trang
          </p>
          <p>
            <FontAwesomeIcon className={'info-icon'} icon={['fas', 'dollar-sign']} />
            {numberWithCommas(props.item.price)}đ
          </p>
          <p>
            <FontAwesomeIcon className={'info-icon'} icon={['fas', 'eye']} />
            {numberWithCommas(props.item.views)}
          </p>
        </div>
        <div className="right-info">
          <p>
            <FontAwesomeIcon className={'info-icon'} icon={['far', 'clock']} />
            {props.item.createdAt}
          </p>
        </div>
      </div>
    </Wrapper>
  );
}

ListItem.propTypes = {
  item: PropTypes.any,
};

export default ListItem;
