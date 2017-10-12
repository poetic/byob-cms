import { get, startCase } from 'lodash'
import React from 'react'

function UpAndDown (props) {
  return <svg width="20px" height="20px" viewBox="0 0 401.998 401.998" {...props}>
    <g>
      <g>
        <path transform="translate(0 -50)" d="M282.082,195.285L149.028,62.24c-1.901-1.903-4.088-2.856-6.562-2.856s-4.665,0.953-6.567,2.856L2.856,195.285
          C0.95,197.191,0,199.378,0,201.853c0,2.474,0.953,4.664,2.856,6.566l14.272,14.271c1.903,1.903,4.093,2.854,6.567,2.854
          c2.474,0,4.664-0.951,6.567-2.854l112.204-112.202l112.208,112.209c1.902,1.903,4.093,2.848,6.563,2.848
          c2.478,0,4.668-0.951,6.57-2.848l14.274-14.277c1.902-1.902,2.847-4.093,2.847-6.566
          C284.929,199.378,283.984,197.188,282.082,195.285z"/>
        <path transform="translate(0 120)" d="M282.082,76.511l-14.274-14.273c-1.902-1.906-4.093-2.856-6.57-2.856c-2.471,0-4.661,0.95-6.563,2.856L142.466,174.441
          L30.262,62.241c-1.903-1.906-4.093-2.856-6.567-2.856c-2.475,0-4.665,0.95-6.567,2.856L2.856,76.515C0.95,78.417,0,80.607,0,83.082
          c0,2.473,0.953,4.663,2.856,6.565l133.043,133.046c1.902,1.903,4.093,2.854,6.567,2.854s4.661-0.951,6.562-2.854L282.082,89.647
          c1.902-1.903,2.847-4.093,2.847-6.565C284.929,80.607,283.984,78.417,282.082,76.511z"/>
      </g>
    </g>
  </svg>
}

function Up (props) {
  return <svg width="20px" height="20px" viewBox="0 0 284.929 284.929" {...props}>
    <g>
      <path d="M282.082,195.285L149.028,62.24c-1.901-1.903-4.088-2.856-6.562-2.856s-4.665,0.953-6.567,2.856L2.856,195.285
        C0.95,197.191,0,199.378,0,201.853c0,2.474,0.953,4.664,2.856,6.566l14.272,14.271c1.903,1.903,4.093,2.854,6.567,2.854
        c2.474,0,4.664-0.951,6.567-2.854l112.204-112.202l112.208,112.209c1.902,1.903,4.093,2.848,6.563,2.848
        c2.478,0,4.668-0.951,6.57-2.848l14.274-14.277c1.902-1.902,2.847-4.093,2.847-6.566
        C284.929,199.378,283.984,197.188,282.082,195.285z"/>
    </g>
  </svg>
}
function Down (props) {
  return <svg width="20px" height="20px" viewBox="0 0 284.929 284.929" {...props}>
    <g>
      <path d="M282.082,76.511l-14.274-14.273c-1.902-1.906-4.093-2.856-6.57-2.856c-2.471,0-4.661,0.95-6.563,2.856L142.466,174.441
        L30.262,62.241c-1.903-1.906-4.093-2.856-6.567-2.856c-2.475,0-4.665,0.95-6.567,2.856L2.856,76.515C0.95,78.417,0,80.607,0,83.082
        c0,2.473,0.953,4.663,2.856,6.565l133.043,133.046c1.902,1.903,4.093,2.854,6.567,2.854s4.661-0.951,6.562-2.854L282.082,89.647
        c1.902-1.903,2.847-4.093,2.847-6.565C284.929,80.607,283.984,78.417,282.082,76.511z"/>
    </g>
  </svg>
}

function SortButton ({ sortOrder, changeSort }) {
  switch (sortOrder) {
    case 'ASC':
      return <Up onClick={() => changeSort('DESC')}/>
    case 'DESC':
      return <Down onClick={() => changeSort('ASC')}/>
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
