import React, {
  Component,
  PropTypes
} from 'react';

export class Game extends Component {


  render() {
    return (
      <div className="" >
        hello
      </div>
    );
  }
}

Game.propTypes = {
  game: PropTypes.string.isRequired,
};

export default Game;
