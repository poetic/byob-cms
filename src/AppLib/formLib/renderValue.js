import React from 'react'

// add a "x" so that the user can remove that item directly
function renderValue (item, parent) {
  return <div  className="value-wrapper">
    <div  className="simple-value">
      <span onClick={() => {
        parent.removeByValue(item.value)
      }}>
        x
      </span>
      <span>{item.label}</span>
    </div>
  </div>
}

export default renderValue
