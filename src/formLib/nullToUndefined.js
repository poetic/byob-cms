function nullToUndefined (data) {
  if (data === null) {
    return undefined
  } else if (Array.isArray(data)) {
    return data.map(nullToUndefined)
  } else if (typeof data === 'object') {
    return Object.keys(data).reduce((acc, key) => {
      return {
        ...acc,
        [key]: nullToUndefined(data[key])
      }
    }, {})
  } else {
    return data
  }
}

export default nullToUndefined
