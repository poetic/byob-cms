import React from 'react'

// add a "x" so that the user can remove that item directly
function renderValue(item, items, parent) {
  const reorder = (value, direction) => {
    let values = items.map(itm => itm.value)
    const indx = values.indexOf(value)
    if (direction === '<') {
      values = [
        ...values.slice(0, indx - 1),
        value,
        values[indx - 1],
        ...values.slice(indx + 1),
      ]
    } else {
      values = [
        ...values.slice(0, indx),
        values[indx + 1],
        value,
        ...values.slice(indx + 2),
      ]
    }
    parent.resortItems(values)
  }

  const index = items.findIndex(itm => itm.label === item.label)
  return (
    <div className="value-wrapper">
      <div className="simple-value">
        {index > 0 &&
          <span
            role="presentation"
            onClick={() => {
              reorder(item.value, '<')
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
        {index < items.length -1 &&
          <span
            role="presentation"
            onClick={() => {
            reorder(item.value, '>')
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
