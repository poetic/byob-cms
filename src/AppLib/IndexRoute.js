import React from 'react'
import { Route, Link, Redirect } from 'react-router-dom';
import { startCase } from 'lodash'
import pluralize from 'pluralize'

function IndexRoute (props) {
  const { config, history } = props
  if (history.location.pathname === '/' && config.initialPath) {
    return <Redirect to={config.initialPath} />
  }

  const indexRouteElement = <Route
    exact
    path='/'
    render={() => {
      const resourceLinks = config
        .resources
        .reduce((acc, resource) => {
          if (resource.crudMapping.readMany) {
            const resourceName = resource.displayName || resource.name

            acc.push(<tr key={resourceName}>
              <td>
                <Link to={`/${resourceName}`}>
                  {startCase(pluralize(resourceName))}
                </Link>
              </td>
            </tr>);
          }
          return acc;
        }, [])

      return <div>
        <h1>Site Administration</h1>
        <table className="table table-striped">
          <tbody>
            {resourceLinks}
          </tbody>
        </table>
      </div>
    }}
  />

  return indexRouteElement
}

export default IndexRoute
