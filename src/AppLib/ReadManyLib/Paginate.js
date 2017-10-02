import React from 'react'
import ReactPaginate from 'react-paginate'

function Paginate ({ skip, limit, total, onSkipChange }) {
  const pageCount = Math.ceil(total / limit)
  const forcePage = Math.ceil(skip / limit)
  return <ReactPaginate
    activeClassName="active"
    containerClassName="react-paginate"
    forcePage={forcePage}
    onPageChange={({ selected }) => onSkipChange(limit * selected)}
    pageCount={pageCount}
    pageRangeDisplayed={5}
    marginPagesDisplayed={3}
  />
}

export default Paginate
