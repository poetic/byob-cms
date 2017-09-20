import React from 'react'
import { gql } from 'react-apollo'
import MultiSelectField from './MultiSelectField'
import graphqlWithoutCache from '../../graphqlWithoutCache'

function DropIdsField(props) {
  const { data: { loading, dropOptions }, ...other } = props
  return <MultiSelectField
    {...other}
    loading={loading}
    optionItems={dropOptions}
  />
}

const DropOptionsQuery = gql`
query DropOptionsQuery {
  dropOptions {
    value
    label
  }
}
`
const DropIdsFieldWithData = graphqlWithoutCache(DropOptionsQuery)(DropIdsField)

export default DropIdsFieldWithData
