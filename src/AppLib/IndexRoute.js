import React from 'react'
import { Route, Link } from 'react-router-dom';

function IndexRoute (props) {
  const { config } = props
  const indexRouteElement = <Route
    exact
    path='/'
    render={() => {
      const resourceLinks = config
        .resources
        .reduce((acc, resource) => {
          if (resource.crudMapping.readMany) {
            acc.push(<li key={resource.name}>
              <Link to={`/${resource.name}`}>
                {resource.name}
              </Link>
            </li>);
          }
          return acc;
        }, [])

      return <div>
        <h1>All Resources</h1>
        <ul>
          {resourceLinks}
        </ul>
      </div>
    }}
  />

  return indexRouteElement
}

export default IndexRoute
