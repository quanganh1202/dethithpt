import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faDollarSign, faEye as fasEye } from '@fortawesome/free-solid-svg-icons';
import { faEye, faFolderOpen, faFileAlt, faClock } from '@fortawesome/free-regular-svg-icons';
import Wrapper from './Wrapper';

library.add(faEye, faDownload, faFolderOpen, faFileAlt, faDollarSign, fasEye, faClock);

const numberWithCommas = (x) => {
  if (x && x.toString) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
  return '';
}

function ListItem(props) {
  return (
    <Wrapper>
      <div className="doc-title">
        <span>
          <Link to={`/tai-lieu/${props.item.id}`}>{props.item.name || 'Đề thi THPT quốc gia chính thức - 2016 - Môn Địa lí - Bộ Giáo dục'}</Link>
        </span>
        <FontAwesomeIcon className={'title-icon'} icon={['far', 'eye']} />
        <FontAwesomeIcon className={'title-icon'} icon={['fas', 'download']} />
      </div>
      <div className="doc-category">
        <ul>
          <li>{_.get(props.item, 'cates[0].cateName')}</li>
          <li>
            {_.get(props.item, 'subjectName', '').includes('Môn') 
              ? props.item.subjectName
              : `Môn ${props.item.subjectName}`}
          </li>
          <li>
            {_.get(props.item, 'class', '').includes('Lớp') 
              ? props.item.className
              : `Lớp ${props.item.className}`}
          </li>
          <li>{props.item.yearSchool}</li>
          <li>
            <FontAwesomeIcon className={'specific-icon'} icon={['far', 'folder-open']} />
            {props.item.collectionName}
          </li>
        </ul>
      </div>
      <div className="doc-information">
        <div className="left-info">
          <p>
            <FontAwesomeIcon className={'info-icon'} icon={['far', 'file-alt']} />
            {props.item.pages || 24} trang
          </p>
          <p>
            <FontAwesomeIcon className={'info-icon'} icon={['fas', 'dollar-sign']} />
            {numberWithCommas(props.item.price)}đ
          </p>
          <p>
            <FontAwesomeIcon className={'info-icon'} icon={['fas', 'eye']} />
            {numberWithCommas(props.item.views || 28960)}
          </p>
        </div>
        <div className="right-info">
          <p>
            <FontAwesomeIcon className={'info-icon'} icon={['far', 'clock']} />
            {moment(_.get(props.item, 'createdAt', '')).format('DD/MM/YYYY')}
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
