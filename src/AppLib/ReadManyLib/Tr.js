import React from 'react'
import TdAction from './TdAction'

function Tr (props) {
  const {
    row,
    resource,
    cellFormatter,
    mutate,
    changeUrl,
    columnNames,
  } = props

  const handleDelete = async () => {
    const confirm = window.confirm('Are you sure you want to delete?')
    if (!confirm) {
      return
    }
    const uniqKeyQuery = { [resource.uniqKey]: row[resource.uniqKey] }
    try {
      await mutate({
        variables: uniqKeyQuery,
        update(store, { data }) {
          changeUrl()
        }
      })
      window.alert('Delete Success')
    } catch (e) {
      window.alert(e)
    }
  }

  const tdFieldElements = columnNames.map((columnName) => {
    return <td key={columnName}>
      {cellFormatter(row[columnName], row, columnName)}
    </td>
  })

  return <tr>
    <TdAction
      key="actions"
      resource={resource}
      row={row}
      handleDelete={handleDelete}
    />
    {tdFieldElements}
  </tr>
}

export default Tr
