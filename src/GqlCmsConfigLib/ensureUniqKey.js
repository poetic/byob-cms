function ensureUniqKey (jsonSchema, uniqKey) {
  return {
    ...jsonSchema,
    properties: {
      [uniqKey]: { type: 'string' },
      ...jsonSchema.properties,
    }
  }
}

export default ensureUniqKey
