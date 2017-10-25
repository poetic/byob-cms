function undefinedToNull (data) {
  if (data === undefined) {
    return null
  } else if (Array.isArray(data)) {
    // remove null in array
    return data.filter((value) => value != null)
  } else if (typeof data === 'object') {
    const obj = Object.keys(data).reduce((acc, key) => {
      return {
        ...acc,
        [key]: undefinedToNull(data[key])
      }
    }, {})
    // use null to replace empty object
    const isPresent = Object.values(obj).some((value) => value !== null)
    return isPresent ? obj : null
  } else {
    return data
  }
}

export default undefinedToNull
