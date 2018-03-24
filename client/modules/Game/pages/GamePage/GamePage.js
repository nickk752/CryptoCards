import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import { Game } from '../../components/Game/Game';

import { getGames } from '../../GameReducer';
import { fetchGame } from '../../GameActions';

export class GamePage extends Component {
  componentDidMount() {
    this.props.dispatch(fetchGame());
  }

  render() {
    return (
      <div>
        <Game game={'hello'} />
      </div>
    );
  }
}

GamePage.need = [() => { return getGames(); }]

function mapStateToProps(state) {
  return {
    game: getGames(state),
  };
}

GamePage.propTypes = {
  game: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};

GamePage.contextTypes = {
  router: React.PropTypes.object,
};

export default connect(mapStateToProps)(GamePage);
