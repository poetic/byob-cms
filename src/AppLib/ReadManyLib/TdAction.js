import React from 'react'
import { Link } from 'react-router-dom';

function TdAction ({ resource, row, handleDelete }) {
  return <td>
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
          delete
        </button>
        : null
    }
  </td>
}

export default TdAction
