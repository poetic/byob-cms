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
import ReactPaginate from 'react-paginate'
import { get } from 'lodash'

function Paginate ({ skip, limit, total, onSkipChange }) {
  const pageCount = Math.ceil(total / limit)
  const forcePage = Math.ceil(skip / limit)
  return <ReactPaginate
    activeClassName="active"
    containerClassName="react-paginate"
    forcePage={forcePage}
    onPageChange={({ selected }) => onSkipChange(limit * selected)}
    pageCount={pageCount}
    pageRangeDisplayed={5}
    marginPagesDisplayed={3}
  />
}

function ThFieldSort ({ columnName, readManySchema, sort, onSortChange }) {
  if (!readManySchema.sortStrategy) {
    return null
  }

  const { type } = readManySchema.sortStrategy

  function changeSort (order) {
    if (type === 'SINGLE') {
      onSortChange([{
        field: columnName,
        order,
      }])
    } else {
      throw new Error(`${type} is not supported.`)
    }
  }

  const sortOrder = get(sort.find(({ field }) => field === columnName), 'order')
  return <div>
    {
      sortOrder !== 'ASC'
        ? <button onClick={() => changeSort('ASC')}>TO ASC</button>
        : null
    }
    {
      sortOrder !== 'DESC'
        ? <button onClick={() => changeSort('DESC')}>TO DESC</button>
        : null
    }
  </div>
}

function ThField ({ columnName, readManySchema, sort, onSortChange }) {
  return <th>
    {columnName}
    <ThFieldSort
      columnName={columnName}
      readManySchema={readManySchema}
      sort={sort}
      onSortChange={onSortChange}
    />
  </th>
}

class ReadMany extends React.Component  {
  constructor(props) {
    super(props)
    const limit = get(props, 'readManySchema.paginationStrategy.itemsPerPage', 10)
    this.state = {
      loading: true,
      items: [],
      total: 0,
      skip: 0,
      limit,
      sort: [],
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

    const { skip, limit, sort } = this.state

    const ReadManyInputQueryString = getReadManyInputQueryString(
      readManySchema,
      { skip, limit, sort }
    )
    const ReadManyQuery = gql`
  query ${crudMapping.readMany} {
    ${crudMapping.readMany} ${ReadManyInputQueryString} {
      items ${fieldsQuery}
      total
    }
  }
  `;

    this.setState({ loading: true })
    client
      .query({ query: ReadManyQuery, fetchPolicy: 'network-only' })
      .then(({ data }) => {
        const { items, total } = data[resource.crudMapping.readMany]
        this.setState({
          loading: false,
          items,
          total,
        })
      })
      .catch((e) => {
        throw e;
      })
  }
  render() {
    const {
      loading,
      items,
      limit,
      total,
      skip,
      sort,
    } = this.state

    if (loading) {
      return null
    }

    const {
      mutate,
      resource,
      readManySchema,
    } = this.props

    const columnNames = Object.keys(readManySchema.jsonSchema.properties)

    const thActionsElement = <th key="actions">Actions</th>
    const thFieldElements = columnNames.map((columnName) => {
      return <ThField
        key={columnName}
        columnName={columnName}
        readManySchema={readManySchema}
        sort={sort}
        onSortChange={(nextSort) => {
          this.setState(
            { sort: nextSort, items: [] },
            () => this.fetchReadMany()
          )
        }}
      />
    })
    const thElements = [thActionsElement].concat(thFieldElements)

    const cellFormatter = readManySchema.cellFormatter || defaultCellFormatter
    const trElements = items.map((row) => <Tr
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
        {
          readManySchema.paginationStrategy
            ? <Paginate
              limit={limit}
              total={total}
              skip={skip}
              onSkipChange={(nextSkip) => this.setState(
                { skip: nextSkip, items: [] },
                () => this.fetchReadMany()
              )}
            />
            : null
        }
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
