import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { Jumbotron } from 'react-bootstrap/lib';
import RaisedButton from 'material-ui/RaisedButton';
//import exodiaCard from './exodia.jpg';

// Import Style
import styles from './HomeJumbotron.css';

function HomeJumbotron(props) {
    return (
        <div className={styles['single-page']}>
            <Jumbotron>
                <h1>Collectible. Tradable. Playable.</h1>
                <p>
                    <img src={'http://940ee6dce6677fa01d25-0f55c9129972ac85d6b1f4e703468e6b.r99.cf2.rackcdn.com/products/pictures/1104180.jpg'} alt='exodia' />Collect and Play with your tradable cards
                </p>
                <p>
                    <RaisedButton label="Get Started Now" primary={true} />
                </p>
            </Jumbotron>
        </div>
    );
}

HomeJumbotron.propTypes = {
    children: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
};

export default HomeJumbotron;