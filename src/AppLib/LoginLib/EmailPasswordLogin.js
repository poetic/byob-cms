import React from 'react'
import { gql, graphql } from 'react-apollo'
import alertFirstGqlMsg from '../../alertFirstGqlMsg'
import { setAccessToken } from '../../StateHOF'
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
      loggingIn: false,
    }
  }

  componentWillUnmount() {
    this.setState({ loggingIn: false })
  }

  render() {
    const onSubmit = async (e) => {
      e.preventDefault()

      this.setState({ loggingIn: true })

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
        this.setState({ loggingIn: false }, () => {
          alertFirstGqlMsg(e)
        })
      }
    }

    const containerStyle = {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }
    const formStyle = {
      width: '300px',
      maxWidth: '100%',
    }
    const h1Style = {
      marginBottom: '20px',
    }
    const buttonStyle = {
      width: '100%',
    }

    const { email, password, loggingIn } = this.state

    return <div style={containerStyle}>
      <h1 style={h1Style}>Login</h1>
      <form onSubmit={onSubmit} style={formStyle}>
        <input
          className="form-control"
          placeholder="Email"
          type="email"
          value={email}
          onChange={e => this.setState({ email: e.target.value })}
        />
        <br/>
        <input
          className="form-control"
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => this.setState({ password: e.target.value })}
        />
        <br/>
        <button
          className="btn btn-primary"
          type="submit"
          style={buttonStyle}
          disabled={loggingIn}
        >
          {loggingIn ? 'Logging in...' : 'Login'}
        </button>
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
