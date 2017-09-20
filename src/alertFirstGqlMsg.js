function alertFirstGqlMsg (e) {
  let message
  try {
    message = e.graphQLErrors[0].message
  } catch (discardedError) {
    message = e
  }
  console.log(e)
  window.alert(message)
}

export default alertFirstGqlMsg
