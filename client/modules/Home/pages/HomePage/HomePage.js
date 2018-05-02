import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';

// Import Components
import HomeJumbotron from '../../components/HomeJumbotron/HomeJumbotron';


class HomePage extends Component {
  render() {
    return (
      <div>
        <HomeJumbotron />
      </div>);
  }
}

function mapStateToProps(store) {
  return {
    intl: store.intl,
  };
}

HomePage.propTypes = {
  // children: PropTypes.object.isRequired,
  // dispatch: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(HomePage);
