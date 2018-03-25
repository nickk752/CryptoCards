import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

// Import Actions
import{ fetchDeck, fetchCards } from '../../InventoryActions';

// Import Selectoes
import{ getDeck } from '../../DeckReducer';
import{ getUserCards } from '../../CardReducer';

// Import Components 
import CardListItem from '../../components/CardListItem/CardListItem';

export function DeckPage(props) {
    return(
        <div>
            <Helmet title = {props.deck.name} />
                <div>
                    <h1> {props.deck.name} </h1>
                    <p> Owner: {props.deck.owner} </p>
                    <p> Deck Number: {props.deck.number} </p>
                </div>
                <h3> Cards </h3>
                <div>
                    {
                        //Only works when you click link. Crashes on reload. Need to get cards and dispatch.
                        props.location.state.cards.map(card => (
                            <CardListItem
                                card = {card}
                                key = {card.cuid}
                            />
                        ))
                    }
                </div>        
        </div>    
    );
}

// Actions required to provide data for this component to render in server side.
DeckPage.need = [params => {
    return fetchDeck(params.cuid);
}];

// Retrieve data from store as props
function mapStateToProps(state, props) {
    return {
      deck: getDeck(state, props.params.cuid),
    };
}

DeckPage.propTypes = {
    deck: PropTypes.shape({
        number: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        owner: PropTypes.string.isRequired,
        slug: PropTypes.string.isRequired,
        cuid: PropTypes.string.isRequired,
    }).isRequired,
    cards: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        owner: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        attack: PropTypes.string.isRequired,
        defense: PropTypes.string.isRequired,
        slug: PropTypes.string.isRequired,
        cuid: PropTypes.string.isRequired,
    })).isRequired,
};

export default connect(mapStateToProps)(DeckPage);