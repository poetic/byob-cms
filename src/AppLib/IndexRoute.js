import React from 'react'
import { Route, Link } from 'react-router-dom';
import { startCase } from 'lodash'
import pluralize from 'pluralize'

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
            acc.push(<tr key={resource.name}>
              <td>
                <Link to={`/${resource.name}`}>
                  {startCase(pluralize(resource.name))}
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
