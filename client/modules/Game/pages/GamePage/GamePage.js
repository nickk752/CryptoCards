import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import { Game } from '../../components/Game';

class GamePage extends Component {
  render() {
    return (
      <div>
        <Game />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    game: 'CryptoCards',
  };
}

GamePage.contextTypes = {
  router: React.PropTypes.object,
};

export default connect(mapStateToProps)(GamePage);