/**
 * Root Component
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import IntlWrapper from './modules/Intl/IntlWrapper';
import { Web3Provider } from 'react-web3';
const Web3 = require('web3');

// Import Routes
import routes from './routes';

// Base stylesheet
require('./main.css');

export default function App(props) {
  const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
  //const network = await web3.version.getNetwork();
  //console.log('network is');
  //console.log(network);
  return (
    <Provider store={props.store}>
      <IntlWrapper>
        <Router history={browserHistory}>
          {routes}
        </Router>
      </IntlWrapper>
    </Provider>
  );
}

App.propTypes = {
  store: PropTypes.object.isRequired,
};
