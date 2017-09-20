import React from 'react'
import { gql } from 'react-apollo'
import MultiSelectField from './MultiSelectField'
import graphqlWithoutCache from '../../graphqlWithoutCache'

function LifeEventIdsField(props) {
  const { data: { loading, lifeEventOptions }, ...other } = props
  return <MultiSelectField
    {...other}
    loading={loading}
    optionItems={lifeEventOptions}
  />
}

const LifeEventOptionsQuery = gql`
query LifeEventOptionsQuery {
  lifeEventOptions {
    value
    label
  }
}
`
const LifeEventIdsFieldWithData = graphqlWithoutCache(LifeEventOptionsQuery)(LifeEventIdsField)

export default LifeEventIdsFieldWithData
