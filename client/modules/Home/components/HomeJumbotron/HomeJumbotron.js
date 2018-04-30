import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { Jumbotron } from 'react-bootstrap/lib';
import RaisedButton from 'material-ui/RaisedButton';
import cardback from '../../pages/cardback.svg';

// Import Style
import styles from './HomeJumbotron.css';

function HomeJumbotron(props) {
  return (
    <div>
      <Jumbotron>
        <h1 justify="center">Collectible. Tradable. Playable.</h1>
        <br />
        <p>
          <img
            style={{
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
              width: '50%',
              height: 600,
            }}
            src={cardback}
            alt="cardback"
          />
          Collect and Play with your tradable cards
        </p>
        <p>
          <RaisedButton label="Get Started Now" primary={true} />
        </p>
      </Jumbotron>
    </div>
  );
}

HomeJumbotron.propTypes = {
  // children: PropTypes.object.isRequired,
  // dispatch: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

export default HomeJumbotron;
