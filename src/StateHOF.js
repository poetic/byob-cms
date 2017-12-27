import React from 'react';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { ApolloClient, ApolloProvider, createNetworkInterface } from 'react-apollo';
import { get, once } from 'lodash'

const existingAccessToken = process.browser
  ? window.localStorage.getItem('accessToken')
  : null

function accessToken (state=existingAccessToken, action) {
  switch (action.type) {
    case 'SET_ACCESS_TOKEN':
      return action.accessToken
    default:
      return state
  }
}

function setAccessToken (accessToken) {
  if (accessToken) {
    window.localStorage.setItem('accessToken', accessToken)
  } else {
    window.localStorage.removeItem('accessToken')
  }
  return {
    type: 'SET_ACCESS_TOKEN',
    accessToken,
  }
}

function createProvider ({ config: { graphqlUrl } }) {
  const networkInterface = createNetworkInterface({
    uri: graphqlUrl,
  })

  networkInterface.use([{
    applyMiddleware(req, next) {
      if (!req.options.headers) {
        req.options.headers = {};  // Create the header object if needed.
      }
      req.options.headers['authorization'] = localStorage.getItem('accessToken') || null;
      next();
    },
  }])

  networkInterface.useAfter([{
    async applyAfterware({ response }, next) {
      const text = await response.clone().text()
      const firstErrorMessage = get(JSON.parse(text), 'errors.0.message')
      if (firstErrorMessage === 'not-authorized') {
        store.dispatch(setAccessToken(null))
      }
      next();
    },
  }])

  const client = new ApolloClient({
    networkInterface,
  });

  const initialState = {};

  // If you are using the devToolsExtension, you can add it here also
  const reduxDevtoolMiddleware = (typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined')
    ? window.__REDUX_DEVTOOLS_EXTENSION__()
    : f => f;

  const store = createStore(
    combineReducers({
      apollo: client.reducer(),
      accessToken,
    }),
    initialState,
    compose(
      applyMiddleware(client.middleware()),
      reduxDevtoolMiddleware,
    )
  );

  return (props) => {
    return <ApolloProvider store={store} client={client}>
      {props.children}
    </ApolloProvider>
  }
}

const createProviderOnce = once(createProvider)

export default function StateHOF (Component) {
  return (props) => {
    const Provider = createProviderOnce(props)
    return <Provider>
      <Component {...props}/>
    </Provider>
  }
}

export { accessToken, setAccessToken }
