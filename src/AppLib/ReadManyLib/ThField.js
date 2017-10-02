import { get } from 'lodash'
import React from 'react'

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
  return <div>
    {
      sortOrder !== 'ASC'
        ? <button onClick={() => changeSort('ASC')}>TO ASC</button>
        : null
    }
    {
      sortOrder !== 'DESC'
        ? <button onClick={() => changeSort('DESC')}>TO DESC</button>
        : null
    }
  </div>
}

function ThField ({ columnName, readManySchema, sort, onSortChange }) {
  return <th>
    {columnName}
    <ThFieldSort
      columnName={columnName}
      readManySchema={readManySchema}
      sort={sort}
      onSortChange={onSortChange}
    />
  </th>
}

export default ThField
