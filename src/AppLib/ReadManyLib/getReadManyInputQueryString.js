function getReadManyInputQueryString (schema, variables={}) {
  const { paginationStrategy, sortStrategy, searchStrategy } = schema
  const inputPairs = []
  if (paginationStrategy) {
    inputPairs.push({ key: 'skip', value: variables.skip })
    inputPairs.push({ key: 'limit', value: variables.limit })
  }

  if (sortStrategy) {
    // note: the replace is used to remove quotes from properties
    inputPairs.push({
      key: 'sort',
      value: JSON.stringify(variables.sort).replace(/"([^(")"]+)":/g,"$1:")
    })
  }

  if (searchStrategy) {
    inputPairs.push({
      key: 'search',
      value: `"${variables.search}"`
    })
  }

  const string = inputPairs
    .map(({ key, value }) => {
      return [key, value].join(': ')
    })
    .join(', ')

  return `(${string})`
}

export default getReadManyInputQueryString
