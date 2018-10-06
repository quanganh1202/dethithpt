import React from 'react';
import {
  Pagination,
  PaginationItem,
  PaginationLink,
} from 'reactstrap';

const PaginationTable = (props) => {
  const adjustPages = Math.floor((props.maxPages - 1) / 2);
  const totalPages = Math.ceil(props.total / props.size);
  const prevPages = props.currentPage - adjustPages > 0
    ? adjustPages
    : adjustPages + (props.currentPage - adjustPages) - 1;
  const nextPages = props.currentPage + adjustPages <= totalPages
    ? adjustPages
    : totalPages - props.currentPage;
  const renderNextPages = (current, pages) => {
    const nextPages = [];
    for (let i = 1; i <= pages; i++) {
      nextPages.push(<PaginationItem key={i} data-index={current + i} onClick={onClick}>
        <PaginationLink tag="button">{current + i}</PaginationLink>
      </PaginationItem>)
    }
    return nextPages;
  }
  const renderPrevPages = (current, pages) => {
    const nextPages = [];
    for (let i = pages; i > 0; i--) {
      nextPages.push(<PaginationItem key={i} data-index={current - i} onClick={onClick}>
        <PaginationLink tag="button">{current - i}</PaginationLink>
      </PaginationItem>)
    }
    return nextPages;
  }
  const onClick = (e) => {
    const page = e.currentTarget.dataset.index;
    props.onClick(parseInt(page));
  }
  return (
    <Pagination style={{ marginTop: '10px', float: 'right' }}>
      {props.currentPage - adjustPages > 0 && <PaginationItem data-index={1} onClick={onClick}>
        <PaginationLink previous tag="button">&#171; First</PaginationLink>
      </PaginationItem>}
      {props.currentPage > 1 && <PaginationItem data-index={props.currentPage - 1} onClick={onClick}>
        <PaginationLink previous tag="button">&#171; Prev</PaginationLink>
      </PaginationItem>}
      {renderPrevPages(props.currentPage, prevPages)}
      <PaginationItem active>
        <PaginationLink tag="button">{props.currentPage}</PaginationLink>
      </PaginationItem>
      {renderNextPages(props.currentPage, nextPages)}
      {props.currentPage < totalPages && <PaginationItem data-index={props.currentPage + 1} onClick={onClick}>
        <PaginationLink next tag="button">Next &#187;</PaginationLink>
      </PaginationItem>}
      {totalPages - props.currentPage > adjustPages && <PaginationItem data-index={totalPages} onClick={onClick}>
        <PaginationLink next tag="button">Last &#187;</PaginationLink>
      </PaginationItem>}
    </Pagination>
  )
}

export default PaginationTable;