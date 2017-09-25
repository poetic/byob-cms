import React from 'react'
import { gql, graphql } from 'react-apollo';
import { Link } from 'react-router-dom';
import jsonSchemaToGqlQuery from '../GqlCmsConfigLib/jsonSchemaToGqlQuery';
import getCRUDSchemaFromResource from '../GqlCmsConfigLib/getCRUDSchemaFromResource'
import ensureUniqKey from '../GqlCmsConfigLib/ensureUniqKey'
import getReadManyInputQueryString from './ReadManyLib/getReadManyInputQueryString'
import defaultCellFormatter from './ReadManyLib/defaultCellFormatter'
import Tr from './ReadManyLib/Tr'
import { withApollo } from 'react-apollo'

class ReadMany extends React.Component  {
  constructor(props) {
    super(props)
    this.state = {
      data: { loading: true },
      skip: null,
      limit: null,
    }
  }
  componentDidMount() {
    this.fetchReadMany()
  }
  fetchReadMany() {
    const { readManySchema, resource, client } = this.props
    const { uniqKey, crudMapping } = resource;
    const fieldsQuery = jsonSchemaToGqlQuery(
      ensureUniqKey(readManySchema.jsonSchema, uniqKey)
    )

    const ReadManyInputQueryString = getReadManyInputQueryString(readManySchema)
    const ReadManyQuery = gql`
  query ${crudMapping.readMany} {
    ${crudMapping.readMany} ${ReadManyInputQueryString} ${fieldsQuery}
  }
  `;

    client
      .query({ query: ReadManyQuery, fetchPolicy: 'network-only' })
      .then(({ data }) => {
        this.setState({
          data,
        })
      })
      .catch((e) => {
        throw e;
      })
  }
  render() {
    const { data } = this.state

    if (data.loading) {
      return null
    }

    const {
      mutate,
      resource,
      readManySchema,
    } = this.props

    const columnNames = Object.keys(readManySchema.jsonSchema.properties)
    const rows = data[resource.crudMapping.readMany]

    const thActionsElement = <th key="actions">Actions</th>
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
      fetchReadMany={() => this.fetchReadMany()}
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
      <div style={{ overflowX: 'scroll' }}>
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
    </div>
  }
}

function ReadManyWithData (props) {
  const { config, resource } = props;
  const { uniqKey, crudMapping } = resource;
  const readManySchema = getCRUDSchemaFromResource({
    config,
    resource,
    crudType: 'readMany',
  })

  let Component = withApollo(ReadMany)

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
  />
}

export default ReadManyWithData
