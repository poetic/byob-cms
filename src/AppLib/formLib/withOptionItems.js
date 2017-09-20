import React from 'react'
import { gql } from 'react-apollo'
import { get, flow, upperFirst, last, endsWith } from 'lodash'
import { withApollo } from 'react-apollo'

function withGql (Component) {
  class WithGqlComponent extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        loading: true,
        optionItems: [],
      }
    }

    componentDidMount() {
      const { gqlOptionsName, client } = this.props

      const query = gql`
query ${upperFirst(gqlOptionsName)}Query {
  ${gqlOptionsName} {
    value
    label
  }
}`

      client
        .query({ query, fetchPolicy: 'network-only' })
        .then(({ data }) => {
          this.setState({
            loading: false,
            optionItems: data[gqlOptionsName],
          })
        })
        .catch((e) => {
          throw e;
        })
    }

    render() {
      if (this.state.loading) {
        return null
      }
      return <Component {...this.props} optionItems={this.state.optionItems}/>
    }
  }

  return WithGqlComponent
}

function idToGqlOptionsName (id) {
  let name = last(id.split('_'))
  if (endsWith(name, 'Id')) {
    name = name.replace(/Id$/, '')
  } else if (endsWith(name, 'Ids')) {
    name = name.replace(/Ids$/, '')
  }
  return name + 'Options'
}

function withGqlOptionNameForWidget (Component) {
  function WithGqlOptionNameComponent (props) {
    const gqlOptionsName = props.options.gqlOptionsName
      || idToGqlOptionsName(props.id)
    return <Component {...props} gqlOptionsName={gqlOptionsName}/>
  }
  return WithGqlOptionNameComponent
}

function withGqlOptionNameForField (Component) {
  function WithGqlOptionNameComponent (props) {
    const gqlOptionsName = get(props, 'uiSchema.ui:options.gqlOptionsName')
      || idToGqlOptionsName(props.name)
    return <Component {...props} gqlOptionsName={gqlOptionsName}/>
  }
  return WithGqlOptionNameComponent
}

const withGqlOptionNameMap = {
  widget: withGqlOptionNameForWidget,
  field: withGqlOptionNameForField,
}

function withOptionItems (Component, type) {
  return flow(withGql, withGqlOptionNameMap[type], withApollo)(Component)
}

export default withOptionItems
