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
import documentIcon from 'images/document.png';
import wordIcon from 'images/word.png';
import pdfIcon from 'images/pdf.png';
import winrarIcon from 'images/winrar.png';

library.add(faEye, faDownload, faFolderOpen, faFileAlt, faDollarSign, fasEye, faClock);

const numberWithCommas = (x) => {
  if (x && x.toString) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
  return '';
}

const mappingIconType = (type) => {
  switch (type) {
    case 'doc':
    case 'docx':
      return wordIcon;
    case 'pdf':
      return pdfIcon;
    default: 
      return winrarIcon;
  }
}

function ListItem(props) {
  const documentType = props.item.path.split('.').pop();
  return (
    <Wrapper>
      <div className="doc-title">
        <span className="document-icon">
          <img src={mappingIconType(documentType)} width="15px" alt="document-type-icon" />
        </span>
        <span>
          <Link to={`/tai-lieu/${props.item.id}`}>{props.item.name || 'Đề thi THPT quốc gia chính thức - 2016 - Môn Địa lí - Bộ Giáo dục'}</Link>
        </span>
        <span className="document-action-icon" onClick={() => props.onPreview(props.item.id)} title="Xem thử tài liệu">
          <FontAwesomeIcon className={'title-icon'} icon={['far', 'eye']} />
        </span>
        <span className="document-action-icon" onClick={() => props.onDownload(props.item.id, 
          `${_.get(props, 'item.name', 'download')}.${
          _.get(props, 'item.path', 'name.doc').split('.')[1]
        }`)} title="Tải tài liệu">
          <FontAwesomeIcon className={'title-icon'} icon={['fas', 'download']} />
        </span>
      </div>
      <div className="doc-category">
        <ul>
          {_.get(props.item, 'cates', []).map((i) => <li key={i.cateId}>
            <Link to={`/danh-muc/${i.cateId}`}>{i.cateName}</Link>
          </li>)}
          {_.get(props.item, 'subjects', []).map((i) => <li key={i.subjectId}>
            {i.subjectName.includes('Môn') ? i.subjectName : `Môn ${i.subjectName}`}
          </li>)}
          {_.get(props.item, 'classes', []).map((i) => <li key={i.classId}>
            {i.className.includes('Lớp') ? i.className : `Lớp ${i.className}`}
          </li>)}
          {_.get(props.item, 'yearSchools', []).map((i) => <li key={i}>{i}</li>)}
          {_.get(props.item, 'collections', []).map((i) => <li key={i.collectionId}>
            <FontAwesomeIcon className={'specific-icon'} icon={['far', 'folder-open']} />
            <Link to={`/bo-suu-tap/${i.collectionId}`}>{i.collectionName}</Link>
          </li>)}
        </ul>
      </div>
      <div className="doc-information">
        <div className="left-info">
          <p>
            <FontAwesomeIcon className={'info-icon'} icon={['far', 'file-alt']} />
            {props.item.totalPages || 0} trang
          </p>
          <p>
            <FontAwesomeIcon className={'info-icon'} icon={['fas', 'dollar-sign']} />
            {numberWithCommas((props.item.price || 0).toString())}đ
          </p>
          <p>
            <FontAwesomeIcon className={'info-icon'} icon={['fas', 'eye']} />
            {numberWithCommas((props.item.views || 0).toString())}
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
