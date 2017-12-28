import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { setAccessToken } from '../StateHOF'

function NavBar (props) {
  const { accessToken, setAccessToken, config } = props
  const brand = config.brand || 'CMS'

  function handleClick () {
    setAccessToken(null)
    window.location = '/'
  }

  return <nav className="navbar navbar-default">
    <div className="container-fluid">
      <div className="navbar-header">
        <Link
          className="navbar-brand"
          to="/"
        >
          {brand}
        </Link>
      </div>
      <ul className="nav navbar-nav navbar-right">
        <li>
          {
            accessToken
              ? <a onClick={handleClick}>Logout</a>
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
