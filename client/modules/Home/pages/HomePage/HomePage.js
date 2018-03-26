import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

// Import Components
import HomeJumbotron from '../../components/HomeJumbotron/HomeJumbotron';
import NextPart from '../../components/NextPart/NextPart';


class HomePage extends Component {
  render() {
    return (
      <div>
        <HomeJumbotron />
        <NextPart />
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
