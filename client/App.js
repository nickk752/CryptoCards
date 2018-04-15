/**
 * Root Component
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import IntlWrapper from './modules/Intl/IntlWrapper';
import { Web3Provider } from 'react-web3';

// Import Routes
import routes from './routes';

// Base stylesheet
require('./main.css');

export default function App(props) {
  return (
    <Web3Provider passive={true}>
      <Provider store={props.store}>
        <IntlWrapper>
          <Router history={browserHistory}>
            {routes}
          </Router>
        </IntlWrapper>
      </Provider>
    </Web3Provider>
  );
}

App.propTypes = {
  store: PropTypes.object.isRequired,
};
