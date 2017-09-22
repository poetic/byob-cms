import React from 'react'
import { connect } from 'react-redux';
import { setAccessToken } from '../StateHOF'

function NavBar (props) {
  const { accessToken, setAccessToken } = props

  return <nav className="navbar navbar-default">
    <div className="container-fluid">
      <ul className="nav navbar-nav navbar-right">
        <li>
          {
            accessToken
              ? <a onClick={() => setAccessToken(null)}>Logout</a>
              : null
          }
        </li>
      </ul>
    </div>
  </nav>
}

const NavBarWithState = connect(
  (state) => ({ accessToken: state.accessToken }),
  { setAccessToken }
)(NavBar)


export default NavBarWithState
