import 'babel-polyfill';
import React, { Component } from 'react';
import StateHOF, { GuardAccessToken } from './StateHOF';
import { BrowserRouter, Route } from 'react-router-dom';
import Login from './AppLib/Login'
import CreateOrReadOne from './AppLib/CreateOrReadOne';
import ReadMany from './AppLib/ReadMany';
import Update from './AppLib/Update';
import IndexRoute from './AppLib/IndexRoute';

class App extends Component {
  render() {
    const { config } = this.props
    const resourceRouteElements = config
      .resources
      .reduce((acc, resource) => {
        const { uniqKey } = resource
        const {
          create,
          readMany,
          readOne,
          update,
        } = resource.crudMapping

        if (readMany) {
          const path = `/${resource.name}`
          acc.push(<Route
            key={path}
            exact
            path={path}
            render={(props) => <ReadMany resource={resource} {...props}/>}
          />);
        }
        if (create || readOne) {
          const path = `/${resource.name}/:${uniqKey}`
          acc.push(<Route
            key={path}
            exact
            path={path}
            render={(props) => <CreateOrReadOne resource={resource} {...props}/>}
          />);
        }
        if (update) {
          const path = `/${resource.name}/:${uniqKey}/edit`
          acc.push(<Route
            key={path}
            exact
            path={path}
            render={(props) => <Update resource={resource} {...props}/>}
          />);
        }
        return acc;
      }, [])

    return (
      <BrowserRouter>
        <div className="container-fluid">
          <IndexRoute config={config}/>
          {resourceRouteElements}
        </div>
      </BrowserRouter>
    );
  }
}

export default StateHOF(GuardAccessToken(App, Login));
