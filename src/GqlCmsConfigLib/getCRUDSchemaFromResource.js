function getCRUDSchemaFromResource ({ config, resource, crudType }) {
  const key = crudType + 'Schema'
  const schema = {
    ...config.defaultSchema,
    ...config[key],
    ...resource.defaultSchema,
    ...resource[key],
  }
  return schema
}

export default getCRUDSchemaFromResource
