import { toast } from 'react-toastify'

function alertFirstGqlMsg (e) {
  let message
  try {
    message = e.graphQLErrors[0].message
  } catch (discardedError) {
    message = e.message
  }
  console.error(e)
  toast.error(message)
}

export default alertFirstGqlMsg
