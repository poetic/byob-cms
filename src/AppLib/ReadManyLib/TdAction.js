import React from 'react'
import { Link } from 'react-router-dom';

function TdAction ({ resource, row, handleDelete }) {
  return <td style={{ display: 'inline-flex' }}>
    {
      resource.crudMapping.readOne
        ? <Link to={`/${resource.name}/${row[resource.uniqKey]}`}>
          <button>view</button>
        </Link>
        : null
    }
    {
      resource.crudMapping.update
        ? <Link to={`/${resource.name}/${row[resource.uniqKey]}/edit`}>
          <button>update</button>
        </Link>
        : null
    }
    {
      resource.crudMapping.delete
        ? <button onClick={handleDelete}>delete</button>
        : null
    }
  </td>
}

export default TdAction
