import React from 'react'
import qs from 'qs'
import { gql, withApollo } from 'react-apollo';
import { Link } from 'react-router-dom';
import { get, startCase } from 'lodash'
import pluralize from 'pluralize'
import jsonSchemaToGqlQuery from '../GqlCmsConfigLib/jsonSchemaToGqlQuery';
import getCRUDSchemaFromResource from '../GqlCmsConfigLib/getCRUDSchemaFromResource'
import ensureUniqKey from '../GqlCmsConfigLib/ensureUniqKey'
import getReadManyInputQueryString from './ReadManyLib/getReadManyInputQueryString'
import defaultCellFormatter from './ReadManyLib/defaultCellFormatter'
import Tr from './ReadManyLib/Tr'
import Paginate from './ReadManyLib/Paginate'
import Search from './ReadManyLib/Search'
import ThField from './ReadManyLib/ThField'
import alertFirstGqlMsg from '../alertFirstGqlMsg'

const DEFAULT_ITEMS_PER_PAGE = 15

class ReadMany extends React.Component  {
  constructor(props) {
    super(props)
    // NOTE: loading is not used in render, we may need it later on
    this.state = {
      loading: true,
      items: [],
      total: 0,
    }
  }
  componentDidMount() {
    this.fetchReadMany(this.props)
  }
  componentWillReceiveProps(nextProps) {
    this.fetchReadMany(nextProps)
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
  fetchReadMany(props) {
    const { readManySchema, resource, client } = props
    const { uniqKey, crudMapping } = resource;
    const fieldsQuery = jsonSchemaToGqlQuery(
      ensureUniqKey(readManySchema.jsonSchema, uniqKey)
    )

    const { limit, sort, search, skip } = props.queryParams

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
        alertFirstGqlMsg(e);

        throw e;
      })
  }
  render() {
    const {
      items,
      total,
    } = this.state

    const {
      queryParams: {
        skip,
        limit,
        sort,
        search,
      },
      client: { mutate },
      resource,
      readManySchema,
    } = this.props

    const { properties } = readManySchema.jsonSchema
    const columnNames = Object.keys(properties)

    const thActionsElement = <th style={{ textAlign: 'right' }} key="actions">
      Actions
    </th>
    const thFieldElements = columnNames.map((columnName) => {
      const { title } = properties[columnName]

      return <ThField
        key={columnName}
        columnName={title || columnName}
        readManySchema={readManySchema}
        sort={sort}
        onSortChange={(nextSort) => {
          this.changeUrl({ sort: nextSort })
        }}
      />
    })
    const thElements = thFieldElements.concat(thActionsElement)

    const cellFormatter = readManySchema.cellFormatter || defaultCellFormatter
    const trElements = items.map((row, index) => <Tr
      key={index}
      row={row}
      resource={resource}
      cellFormatter={cellFormatter}
      mutate={mutate}
      changeUrl={(paramsOverride) => this.changeUrl(paramsOverride)}
      columnNames={columnNames}
    />)

    const resourceName = resource.displayName || resource.name

    return <div>
      <h1>
        List of { startCase(pluralize(resourceName)) }
        { readManySchema.showTotal ? ` (total: ${total})` : null }
        {
          resource.crudMapping.create
            ? <Link
              style={{float: 'right'}}
              className="btn btn-primary btn-outline"
              to={`/${resourceName}/new`}
            >
              Add New
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

const ReadManyWithApollo = withApollo(ReadMany);

function ReadManyWithData(props) {
  const {
    config,
    resource,
    location,
  } = props;

  const readManySchema = getCRUDSchemaFromResource({
    config,
    resource,
    crudType: 'readMany',
  });

  const { search } = location;
  const limit = get(
    readManySchema,
    'paginationStrategy.itemsPerPage',
    DEFAULT_ITEMS_PER_PAGE,
  );
  const defaultQueryParams = { limit, skip: 0, sort: [], search: '' };
  const overrideQueryParams = search ? qs.parse(search.substring(1)) : {};
  const queryParams = { ...defaultQueryParams, ...overrideQueryParams };

  return (
    <ReadManyWithApollo
      {...props}
      queryParams={queryParams}
      readManySchema={readManySchema}
    />
  );
}

export default ReadManyWithData
