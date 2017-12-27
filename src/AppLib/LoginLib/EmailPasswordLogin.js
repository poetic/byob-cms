import React from 'react'
import { gql, graphql } from 'react-apollo'
import alertFirstGqlMsg from '../../alertFirstGqlMsg'
import { setAccessToken } from '../../StateHOF';
import { connect } from 'react-redux'

const LoginMutation = gql`
  mutation LoginMutation($loginInput: LoginInput!) {
    login(loginInput: $loginInput)
  }
`

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
    }
  }

  render() {
    const onSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await this.props.mutate({
          variables: {
            loginInput: {
              email: this.state.email,
              password: this.state.password,
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
      alignItems: 'center',
    }
    const buttonStyle = {
      width: '100%',
    }

    return <div style={containerStyle}>
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <input
          placeholder="email"
          type="email"
          value={this.state.email}
          onChange={e => this.setState({ email: e.target.value })}
        />
        <br/>
        <input
          placeholder="password"
          type="password"
          value={this.state.password}
          onChange={e => this.setState({ password: e.target.value })}
        />
        <br/>
        <button type="submit" style={buttonStyle}>Login</button>
      </form>
    </div>
  }
}

const LoginFormWithData = graphql(LoginMutation)(Login)

const LoginFormWithState = connect(
  (state) => ({ accessToken: state.accessToken }),
  { setAccessToken }
)(LoginFormWithData)

export default LoginFormWithState
