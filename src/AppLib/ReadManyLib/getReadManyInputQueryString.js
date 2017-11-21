function getReadManyInputQueryString (schema, variables={}) {
  const { paginationStrategy, sortStrategy, searchStrategy } = schema
  const inputPairs = []
  if (paginationStrategy) {
    inputPairs.push({ key: 'skip', value: variables.skip })
    inputPairs.push({ key: 'limit', value: variables.limit })
  }

  if (sortStrategy) {
    // note: the replace is used to remove quotes from properties
    const sortValue = [].concat(variables.sort)
    const shouldAddDefaultSort = sortStrategy.type === 'SINGLE'
      && sortValue.length === 0
      && sortStrategy.defaultSortField
    if (shouldAddDefaultSort) {
      sortValue.push({
        field: sortStrategy.defaultSortField,
        order: 'ASC',
      })
    }
    inputPairs.push({
      key: 'sort',
      value: JSON.stringify(sortValue).replace(/"([^(")"]+)":/g,"$1:"),
    })
    console.log('inputPairs: ', inputPairs)
  }

  if (searchStrategy) {
    inputPairs.push({
      key: 'search',
      value: `"${variables.search}"`
    })
  }

  if (Object.keys(inputPairs).length === 0) {
    return ''
  }

  const string = inputPairs
    .map(({ key, value }) => {
      return [key, value].join(': ')
    })
    .join(', ')

  return `(${string})`
}

export default getReadManyInputQueryString
