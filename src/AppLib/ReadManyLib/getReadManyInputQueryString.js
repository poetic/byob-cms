function stringifyInput (input) {
  const keys = Object.keys(input)
  if (keys.length === 0) {
    return ''
  }
  const string = keys
    .map((key) => {
      return [key, input[key]].join(': ')
    })
    .join(' ')
  return `(${string})`
}

function getReadManyInputQueryString (schema) {
  const { paginationStrategy } = schema
  const input = {}
  // construct input query for pagination
  if (paginationStrategy) {
    // TODO: add skip and limit
  }
  return stringifyInput(input)
}

export default getReadManyInputQueryString
