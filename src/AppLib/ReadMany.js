import React from 'react'
import { gql, graphql } from 'react-apollo';
import { remove } from 'lodash';
import { Link } from 'react-router-dom';

class ReadMany extends React.Component  {
  componentDidMount() {
    const { loading, refetch } = this.props.data
    if (!loading) {
      refetch()
    }
  }
  render() {
    const { data, mutate, resource, ReadManyQuery } = this.props

    if (data.loading) {
      return null
    }
    const columnNames = Object.keys(resource.readManySchema.jsonSchema.properties)
    const rows = data[resource.crudMapping.readMany]

    const thActionsElement = <th key="actions">
      Actions
    </th>
      const thFieldElements = columnNames.map((columnName) => {
        return <th key={columnName}>{columnName}</th>
      })
    const thElements = [thActionsElement].concat(thFieldElements)

    const trElements = rows.map((row) => {
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
      const tdActionElement = <td key="actions">
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
        const tdFieldElements = columnNames.map((columnName) => {
          return <th key={columnName}>{row[columnName]}</th>
        })
      const tdElements = [tdActionElement].concat(tdFieldElements)
      return <tr key={row[resource.uniqKey]}>
        {tdElements}
      </tr>
    })

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
  const columnNames = Object.keys(resource.readManySchema.jsonSchema.properties)

  let Component = ReadMany
  const ReadManyQuery = gql`
  query ${crudMapping.readMany} {
    ${crudMapping.readMany} {
      ${columnNames.join('\n')}
    }
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
    ReadManyQuery={ReadManyQuery}
    {...props}
  />
}

export default ReadManyWithData
