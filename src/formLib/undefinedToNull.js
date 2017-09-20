function undefinedToNull (data) {
  if (data === undefined) {
    return null
  } else if (Array.isArray(data)) {
    return data.map(undefinedToNull)
  } else if (typeof data === 'object') {
    return Object.keys(data).reduce((acc, key) => {
      return {
        ...acc,
        [key]: undefinedToNull(data[key])
      }
    }, {})
  } else {
    return data
  }
}

export default undefinedToNull
