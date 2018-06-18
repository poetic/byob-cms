import React from 'react'

// add a "x" so that the user can remove that item directly
function renderValue(item, sortable, items, parent) {
  return (
    <div className="value-wrapper">
      <div className="simple-value">
        {sortable &&
          <span
            role="presentation"
            onClick={() => {
              parent.reorder(item.value, '<')
            }}
          >
            {'<'}
          </span>
        }
        <span
          role="presentation"
          onClick={() => {
            parent.removeByValue(item.value)
          }}
        >
          x
        </span>
        <span>{item.label}</span>
        {sortable &&
          <span
            role="presentation"
            onClick={() => {
            parent.reorder(item.value, '>')
          }}
          >
            {'>'}
          </span>
        }
      </div>
    </div>
  );
}

export default renderValue
