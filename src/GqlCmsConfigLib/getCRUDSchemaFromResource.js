function getCRUDSchemaFromResource ({ resource, crudType }) {
  const key = crudType + 'Schema'
  const schema = resource[key] || resource.defaultSchema
  if (!schema) {
    throw new Error(`You need to define ${key} or defaultSchema.`)
  }
  return schema
}

export default getCRUDSchemaFromResource
