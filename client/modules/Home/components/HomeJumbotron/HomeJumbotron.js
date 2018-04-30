import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { Jumbotron } from 'react-bootstrap/lib';
import { Grid, Row, Col } from 'react-bootstrap';

import RaisedButton from 'material-ui/RaisedButton';
import cardback from '../../pages/cardback.svg';
import card from '../../pages/a-car-card.png';

// Import Style
import styles from './HomeJumbotron.css';

function HomeJumbotron(props) {
  return (
    <Grid>
      <Row className="show-grid">
        <Col md={6}
          style={{
            textAlign: 'left',
          }}>
          <br /><h1 className={styles['heading']}>Collectible.<br />Tradable.<br />Playable.</h1>
          <br />
          <h2 className={styles['subheading']}>  Collect and Play with your tradable cards </h2>
          <a className={styles['get-started-button']} href="#" >Get Started Now</a>
        </Col>
        <Col md={6}>
          <img
            style={{
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
              width: '80%',
              height: '50%',
            }}
            src={cardback}
            alt="cardback"
          />
        </Col>
      </Row>
      <Row className={styles['box-ina-box']}>
        <Col md={6}>
          <h1>What is CryptoCards?</h1>
          <p>
          CryptoCards is an online collectible card game, whose cards are non-fungible ERC-721 tokens on the Ethereum Blockchain. 
          Users can manage their collection, sort cards into decks, or buy and sell cards for Ether on the marketplace. 
          There is also a game that can be played with the cards, a standard turn-based card game much like Hearthstone or Magic: the Gathering. 
                </p>
        </Col>
        <Col md={6}>
          <img
            style={{
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
              width: '80%',
              height: '50%',
            }}
            src={card}
            alt="card"
          />
        </Col>
      </Row>
    </Grid>
  );
}

HomeJumbotron.propTypes = {
};

export default HomeJumbotron;
