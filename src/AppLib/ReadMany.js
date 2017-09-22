import React from 'react'
import { gql, graphql } from 'react-apollo';
import { remove } from 'lodash';
import { Link } from 'react-router-dom';
import jsonSchemaToGqlQuery from '../GqlCmsConfigLib/jsonSchemaToGqlQuery';
import getCRUDSchemaFromResource from '../GqlCmsConfigLib/getCRUDSchemaFromResource'
import ensureUniqKey from '../GqlCmsConfigLib/ensureUniqKey'

function defaultCellFormatter (value) {
  return <pre>
    {JSON.stringify(value, null, 2)}
  </pre>
}

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

function Tr (props) {
  const {
    row,
    resource,
    cellFormatter,
    mutate,
    ReadManyQuery,
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
          const readManyQueryData = store.readQuery({ query: ReadManyQuery })
          remove(readManyQueryData[resource.crudMapping.readMany], uniqKeyQuery)
          store.writeQuery({ query: ReadManyQuery, data: readManyQueryData });
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

class ReadMany extends React.Component  {
  componentDidMount() {
    const { loading, refetch } = this.props.data
    if (!loading) {
      refetch()
    }
  }
  render() {
    const {
      data,
      mutate,
      resource,
      ReadManyQuery,
      readManySchema
    } = this.props

    if (data.loading) {
      return null
    }
    const columnNames = Object.keys(readManySchema.jsonSchema.properties)
    const rows = data[resource.crudMapping.readMany]

    const thActionsElement = <th key="actions">
      Actions
    </th>
      const thFieldElements = columnNames.map((columnName) => {
        return <th key={columnName}>{columnName}</th>
      })
    const thElements = [thActionsElement].concat(thFieldElements)

    const cellFormatter = readManySchema.cellFormatter || defaultCellFormatter
    const trElements = rows.map((row) => <Tr
      key={row[resource.uniqKey]}
      row={row}
      resource={resource}
      cellFormatter={cellFormatter}
      mutate={mutate}
      ReadManyQuery={ReadManyQuery}
      columnNames={columnNames}
    />)

    return <div>
      <h1>{ resource.name } list</h1>
      {
        resource.crudMapping.create
          ? <Link to={`/${resource.name}/new`}>
            <button>create</button>
          </Link>
          : null
      }
      <table className="table">
        <thead>
          <tr>
            {thElements}
          </tr>
        </thead>
        <tbody>
          {trElements}
        </tbody>
      </table>
    </div>
  }
}

function ReadManyWithData (props) {
  const { resource } = props;
  const { uniqKey, crudMapping } = resource;
  const readManySchema = getCRUDSchemaFromResource({
    resource,
    crudType: 'readMany',
    uniqKey,
  })
  const fieldsQuery = jsonSchemaToGqlQuery(
    ensureUniqKey(readManySchema.jsonSchema, uniqKey)
  )

  let Component = ReadMany
  const ReadManyQuery = gql`
  query ${crudMapping.readMany} {
    ${crudMapping.readMany} ${fieldsQuery}
  }
  `;
  Component = graphql(ReadManyQuery)(Component)

  if (crudMapping.delete) {
    const DeleteQuery = gql`
  mutation ${crudMapping.delete}($${uniqKey}: String!) {
    ${crudMapping.delete}(${uniqKey}: $${uniqKey})
  }
  `;
    Component = graphql(DeleteQuery)(Component)
  }

  return <Component
    {...props}
    readManySchema={readManySchema}
    ReadManyQuery={ReadManyQuery}
  />
}

export default ReadManyWithData
