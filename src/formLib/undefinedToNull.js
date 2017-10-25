function undefinedToNull (data) {
  if (data === undefined) {
    return null
  } else if (Array.isArray(data)) {
    // remove null in array
    return data.filter((value) => value != null)
  } else if (typeof data === 'object') {
    // use null to replace empty object
    if (Object.keys(data).length === 0) {
      return null
    }
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
