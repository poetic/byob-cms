function getReadManyInputQueryString (schema, variables={}) {
  const { paginationStrategy } = schema
  if (!paginationStrategy) {
    return ''
  }

  const keys = Object.keys(variables)
  if (keys.length === 0) {
    return ''
  }
  const string = keys
    .map((key) => {
      return [key, variables[key]].join(': ')
    })
    .join(' ')
  return `(${string})`
}

export default getReadManyInputQueryString
