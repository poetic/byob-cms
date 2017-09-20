function removeTypename (data) {
  if (Array.isArray(data)) {
    return data.map(removeTypename)
  } else if (data && typeof data === 'object') {
    const convertedData = {}
    for (const key in data) {
      if (key !== '__typename') {
        convertedData[key] = removeTypename(data[key])
      }
    }
    return convertedData
  } else {
    return data
  }
}

export default removeTypename
