import React from 'react'
import { graphql } from 'react-apollo'
import LoginMutation from '../resolvers/Mutation/LoginMutation'
import alertFirstGqlMsg from '../alertFirstGqlMsg'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      code: ''
    }
  }

  render() {
    const onSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await this.props.mutate({
          variables: {
            loginInput: {
              code: this.state.code
            }
          }
        })
        const token = response.data.login
        this.props.setAccessToken(token)
      } catch (e) {
        alertFirstGqlMsg(e)
      }
    }

    const containerStyle = {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }

    return <div style={containerStyle}>
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <input
          type="password"
          value={this.state.code}
          onChange={e => this.setState({ code: e.target.value })}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  }
}

const LoginFormWithData = graphql(LoginMutation)(Login)

export default LoginFormWithData
