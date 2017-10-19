function undefinedToNull (data) {
  if (data === undefined) {
    return null
  } else if (Array.isArray(data)) {
    // remove null in array
    return data.filter((value) => value != null)
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
