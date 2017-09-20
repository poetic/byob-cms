function jsonSchemaToGqlQuery (jsonSchema) {
  const { type, properties, items } = jsonSchema
  switch (type) {
    case 'string':
    case 'number':
    case 'integer':
      return '';
    case 'object':
      const fields = Object
        .keys(properties)
        .map(key => ({ key, query: jsonSchemaToGqlQuery(properties[key]) }))
        .map(({ key, query }) => query ? `${key} ${query}` : key)
        .join('\n')
      return `{
${fields}
}`
    case 'array':
      const query = jsonSchemaToGqlQuery(items)
      return query
    default:
      throw new Error(`jsonSchemaToGqlQuery unrecognized type: ${type}`)
  }
}

export default jsonSchemaToGqlQuery
