function getCRUDSchemaFromResource ({ resource, crudType }) {
  const key = crudType + 'Schema'
  const schema = {
    ...resource[key],
    ...resource.defaultSchema,
  }
  return schema
}

export default getCRUDSchemaFromResource
