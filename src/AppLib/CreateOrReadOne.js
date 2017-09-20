import React from 'react'
import Create from './Create'
import ReadOne from './ReadOne'

function CreateOrReadOne (props) {
  const uniqKeyValue = props.match.params[props.resource.uniqKey]
  return uniqKeyValue === 'new' ? <Create {...props}/> : <ReadOne {...props}/>
}

export default CreateOrReadOne
