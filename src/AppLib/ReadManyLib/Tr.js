import React from 'react'
import TdAction from './TdAction'
import { toast } from 'react-toastify'

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
      await mutate({ variables: uniqKeyQuery })
      changeUrl()
      toast.success('Delete Success')
    } catch (e) {
      toast.error(e)
    }
  }

  const tdFieldElements = columnNames.map((columnName) => {
    return <td key={columnName}>
      {cellFormatter(row[columnName], row, columnName)}
    </td>
  })

  return <tr>
    {tdFieldElements}
    <TdAction
      key="actions"
      resource={resource}
      row={row}
      handleDelete={handleDelete}
    />
  </tr>
}

export default Tr
