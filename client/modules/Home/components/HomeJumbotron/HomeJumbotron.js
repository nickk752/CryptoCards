import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { Grid, Row, Col } from 'react-bootstrap';

import cardback from '../../pages/cardback.svg';
import card from '../../pages/a-car-card.svg';
import cardCombination from '../../pages/card-combination.png'

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
          <a className={styles['get-started-button']} href="/inventory" >Get Started Now</a>
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
      <Row className={styles['blue-to-white-gradient']}>
        <Col md={6}>
          <h1 className={styles['subheading']}>What is CryptoCards?</h1>
          <p className={styles['subtext']}>
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
              width: '60%',
              height: '50%',
            }}
            src={card}
            alt="card"
          />
        </Col>
      </Row>
      <Row>
        <Col md={3} />
        <Col className={styles['centered']} md={6}>
          <h1 className={styles['subheading']}>What's the Big Deal?</h1>
          <p className={styles['subtext']}>
            CryptoCards is unlike other card games or other ERC-721 tokens. Each card is unique and usable in-game; backed up on the blockchain.
            Unlike other ERC-721 tokens, you can actually play a game with the tokens you purchase!
                </p>
        </Col>
        <Col md={4} />
      </Row>
      <Row>
        <Col className={styles['white-to-blue-gradient']}>
          <img
            style={{
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
              width: '100%',
              height: '100%',
            }}
            src={cardCombination}
            alt="cardCombination"
          />
        </Col>
      </Row>
      <Row>
        <Col className={styles['centered']}>
          <p className={styles['subtext']}>
            In CryptoCards you can even combine your cards to create new unique cards to play with!
                </p>
          <p style={{fontWeight: 'bold'}}>It'll be special, just like you ❤</p>
          <a className={styles['get-started-button']} href="/inventory" >Get Started Now</a>
          <br /><br />
        </Col>
      </Row>
    </Grid>
  );
}

HomeJumbotron.propTypes = {
};

export default HomeJumbotron;
