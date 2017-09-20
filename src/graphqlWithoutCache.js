import React from 'react'
import { withApollo } from 'react-apollo';

class DataFetchingComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
    }
  }
  componentDidMount() {
    const { client, Query } = this.props
    client
      .query({ query: Query, fetchPolicy: 'network-only' })
      .then((res) => {
        this.setState({
          loading: false,
          ...res.data,
        })
      })
      .catch((e) => {
        throw e;
      })
  }
  render() {
    const { Component } = this.props
    return <Component
      data={this.state}
      {...this.props}
    />
  }
}

function graphqlWithoutCache (Query) {
  return (Component) => {
    return withApollo((props) => <DataFetchingComponent
      {...props}
      Query={Query}
      Component={Component}
    />)
  }
}

export default graphqlWithoutCache
