import { gql } from 'react-apollo'

const LoginMutation = gql`
  mutation LoginMutation($loginInput: LoginInput!) {
    login(loginInput: $loginInput)
  }
`

export default LoginMutation
