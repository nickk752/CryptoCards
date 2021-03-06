import React from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router';
import { GridList } from 'material-ui/GridList';
import MultiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// Import Components 
import CardListItem from '../CardListItem/CardListItem';
import DeckCardListItem from '../DeckCardListItem/DeckCardListItem';

//Import Selector
import { getCard } from '../../CardReducer';

function DeckListItem(props) {
    return (
        <div>
            {props.deck.name}
            <h2> {String(props.deck.active)} </h2>
            <button onClick={() => { props.activate(props.deck.cuid) }}>
                ACTIVATE DECK
            </button>
            <MultiThemeProvider>
                <GridList
                    cols={3}
                >
                    {   // using cuid to get card object
                        props.cards.map(card => (
                            <DeckCardListItem
                                card={card}
                                key={card.cuid}
                                deck={props.deck}
                                removeCard={props.removeCard}
                            />
                        ))
                    }
                </GridList>
            </MultiThemeProvider>
        </div>
    );
}

DeckListItem.propTypes = {
    deck: PropTypes.shape({
        number: PropTypes.number.isRequired,
        owner: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        cuid: PropTypes.string.isRequired,
    }).isRequired,
    cards: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        owner: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        attack: PropTypes.string.isRequired,
        defense: PropTypes.string.isRequired,
        decks: PropTypes.array.isRequired,
        slug: PropTypes.string.isRequired,
        cuid: PropTypes.string.isRequired,
    })).isRequired,
};

export default DeckListItem