import React from 'react';
import ReactDOM from 'react-dom';
import './stylesheets/react-selectize.css';
import './stylesheets/react-jsonschemaform.css';
import App from './App';

const config = {
  graphqlUrl: 'http://localhost:4000/admin-graphql',
  resources: [],
}

ReactDOM.render(
  <App config={config}/>,
  document.getElementById('root')
);
