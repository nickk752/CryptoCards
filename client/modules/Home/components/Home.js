import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';

import HomeJumbotron from './components/HomeJumbotron/HomeJumbotron';

function Home(props) {
  return (
    <div>
      {
        props.Home.map(post => (
          <HomeJumbotron />,
          <NextPart />
        ))
      }
    </div>
  )
}

Home.propTypes = {
  children: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

export default Home;