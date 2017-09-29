import React from 'react'
import qs from 'qs'
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
import { startCase } from 'lodash'
import pluralize from 'pluralize'

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

class Search extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      text: this.props.search
    }
  }
  render() {
    const { onSearchChange } = this.props
    const { text } = this.state
    return <div>
      <input
        type="text"
        value={text}
        onChange={(e) => this.setState({ text: e.target.value })}
      />
      <button onClick={() => onSearchChange(text)}>Search</button>
    </div>
  }
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
    this.state = {
      loading: true,
      items: [],
      total: 0,
    }
  }
  componentDidMount() {
    this.fetchReadMany()
  }
  changeUrl(paramsOverride) {
    const { history, location, queryParams } = this.props
    const { skip, limit, search, sort } = { ...queryParams, skip: 0, ...paramsOverride }
    const queryParmasString = qs.stringify({
      skip,
      limit,
      search,
      sort,
    })
    history.push([location.pathname, queryParmasString].join('?'))
  }
  fetchReadMany() {
    const { readManySchema, resource, client } = this.props
    const { uniqKey, crudMapping } = resource;
    const fieldsQuery = jsonSchemaToGqlQuery(
      ensureUniqKey(readManySchema.jsonSchema, uniqKey)
    )

    const { limit, sort, search, skip } = this.props.queryParams

    const ReadManyInputQueryString = getReadManyInputQueryString(
      readManySchema,
      { skip, limit, sort, search }
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
      total,
    } = this.state

    if (loading) {
      return null
    }

    const {
      queryParams: {
        skip,
        limit,
        sort,
        search,
      },
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
          this.changeUrl({ sort: nextSort })
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
      changeUrl={(paramsOverride) => this.changeUrl(paramsOverride)}
      columnNames={columnNames}
    />)

    return <div>
      <h1>
        List of { startCase(pluralize(resource.name)) }
        {
          resource.crudMapping.create
            ? <Link
              style={{float: 'right'}}
              className="btn btn-primary btn-outline"
              to={`/${resource.name}/new`}
            >
              CREATE
            </Link>
            : null
        }
      </h1>
      {
        readManySchema.searchStrategy
          ? <Search
            search={search}
            onSearchChange={(nextSearch) => this.changeUrl({search: nextSearch})}
          />
          : null
      }
      <div style={{ overflowX: 'scroll' }}>
        <table className="table table-striped">
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
              onSkipChange={(nextSkip) => this.changeUrl({ skip: nextSkip })}
            />
            : null
        }
      </div>
    </div>
  }
}

function ReadManyWithData (props) {
  const {
    config,
    resource,
    location,
  } = props;
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

  const { search } = location
  const limit = get(readManySchema, 'paginationStrategy.itemsPerPage', 10)
  const defaultQueryParams = { limit, skip: 0, sort: [], search: '' }
  const overrideQueryParams = search ? qs.parse(search.substring(1)) : {}
  const queryParams = { ...defaultQueryParams, ...overrideQueryParams }

  return <Component
    {...props}
    queryParams={queryParams}
    readManySchema={readManySchema}
  />
}

export default ReadManyWithData
