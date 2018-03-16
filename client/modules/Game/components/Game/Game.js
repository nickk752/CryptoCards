import React, {
  PropTypes
} from 'react';

class Game extends React.Component {
  render() {
    return (
      <div className="" >
        hello
        {
          props.game
        }
      </div>
    );
  }
}

Game.propTypes = {
  game: PropTypes.string.isRequired,
};

export default Game;
