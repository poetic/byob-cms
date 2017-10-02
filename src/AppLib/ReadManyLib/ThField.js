import { get, startCase } from 'lodash'
import React from 'react'

function UpAndDown (props) {
  return <svg width="20px" height="20px" viewBox="0 0 401.998 401.998" {...props}>
    <g>
      <g>
        <path d="M73.092,164.452h255.813c4.949,0,9.233-1.807,12.848-5.424c3.613-3.616,5.427-7.898,5.427-12.847
          c0-4.949-1.813-9.229-5.427-12.85L213.846,5.424C210.232,1.812,205.951,0,200.999,0s-9.233,1.812-12.85,5.424L60.242,133.331
          c-3.617,3.617-5.424,7.901-5.424,12.85c0,4.948,1.807,9.231,5.424,12.847C63.863,162.645,68.144,164.452,73.092,164.452z"/>
        <path d="M328.905,237.549H73.092c-4.952,0-9.233,1.808-12.85,5.421c-3.617,3.617-5.424,7.898-5.424,12.847
          c0,4.949,1.807,9.233,5.424,12.848L188.149,396.57c3.621,3.617,7.902,5.428,12.85,5.428s9.233-1.811,12.847-5.428l127.907-127.906
          c3.613-3.614,5.427-7.898,5.427-12.848c0-4.948-1.813-9.229-5.427-12.847C338.139,239.353,333.854,237.549,328.905,237.549z"/>
      </g>
    </g>
  </svg>
}

function ChevronUp (props) {
  return <svg width="20px" height="20px" viewBox="0 0 401.998 401.998" {...props}>
    <g>
      <g>
        <path d="M73.092,164.452h255.813c4.949,0,9.233-1.807,12.848-5.424c3.613-3.616,5.427-7.898,5.427-12.847
          c0-4.949-1.813-9.229-5.427-12.85L213.846,5.424C210.232,1.812,205.951,0,200.999,0s-9.233,1.812-12.85,5.424L60.242,133.331
          c-3.617,3.617-5.424,7.901-5.424,12.85c0,4.948,1.807,9.231,5.424,12.847C63.863,162.645,68.144,164.452,73.092,164.452z"/>
      </g>
    </g>
  </svg>
}
function ChevronDown (props) {
  return <svg width="20px" height="20px" viewBox="0 0 401.998 401.998" {...props}>
    <g>
      <g>
        <path d="M328.905,237.549H73.092c-4.952,0-9.233,1.808-12.85,5.421c-3.617,3.617-5.424,7.898-5.424,12.847
          c0,4.949,1.807,9.233,5.424,12.848L188.149,396.57c3.621,3.617,7.902,5.428,12.85,5.428s9.233-1.811,12.847-5.428l127.907-127.906
          c3.613-3.614,5.427-7.898,5.427-12.848c0-4.948-1.813-9.229-5.427-12.847C338.139,239.353,333.854,237.549,328.905,237.549z"/>
      </g>
    </g>
  </svg>
}

function SortButton ({ sortOrder, changeSort }) {
  switch (sortOrder) {
    case 'ASC':
      return <ChevronUp onClick={() => changeSort('DESC')}/>
    case 'DESC':
      return <ChevronDown onClick={() => changeSort('ASC')}/>
    default:
      return <UpAndDown onClick={() => changeSort('ASC')}/>
  }
}

function ThFieldSort ({ columnName, readManySchema, sort, onSortChange }) {
  if (!readManySchema.sortStrategy) {
    return null
  }

  const { type } = readManySchema.sortStrategy

  function changeSort (order) {
    if (type === 'SINGLE') {
      onSortChange([{
        field: columnName,
        order,
      }])
    } else {
      throw new Error(`${type} is not supported.`)
    }
  }

  const sortOrder = get(sort.find(({ field }) => field === columnName), 'order')
  const style = {
    float: 'right',
  }
  return <span style={style}>
    <SortButton changeSort={changeSort} sortOrder={sortOrder}/>
  </span>
}

function ThField ({ columnName, readManySchema, sort, onSortChange }) {
  return <th>
    {startCase(columnName)}
    <ThFieldSort
      columnName={columnName}
      readManySchema={readManySchema}
      sort={sort}
      onSortChange={onSortChange}
    />
  </th>
}

export default ThField
