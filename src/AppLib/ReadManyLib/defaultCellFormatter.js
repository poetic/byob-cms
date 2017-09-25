import React from 'react'

function defaultCellFormatter (value) {
  return <pre>
    {JSON.stringify(value, null, 2)}
  </pre>
}

export default defaultCellFormatter
