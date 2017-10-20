import React from 'react'
import { Link } from 'react-router-dom';
import { get } from 'lodash'

function TdAction ({ resource, row, handleDelete }) {
  return <td style={{ textAlign: 'right' }}>
    {
      resource.crudMapping.update
        ? <Link
          className="btn btn-sm btn-primary"
          to={`/${resource.name}/${row[resource.uniqKey]}/edit`}
        >
          Edit
        </Link>
        : null
    }
    {
      resource.crudMapping.delete
        ? <button
          className="btn btn-sm btn-danger"
          onClick={handleDelete}
        >
          Delete
        </button>
        : null
    }
    {
      (resource.crudMapping.readOne && get(resource, 'readOneSchema.show'))
        ? <Link
          className="btn btn-sm btn-info"
          to={`/${resource.name}/${row[resource.uniqKey]}`}
        >
          View
        </Link>
        : null
    }
  </td>
}

export default TdAction
