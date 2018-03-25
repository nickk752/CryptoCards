import React, { PropTypes } from 'react';

// Import Components
import DeckListItem from './DeckListItem/DeckListItem';

function DeckList(props){
    return(
        <div>
            {
                props.decks.map(deck => (
                    <DeckListItem
                        deck = {deck}
                        //this is a mess I know. I'll try to fix this later
                        //cards = {props.cards}
                        cards = {props.cards.filter(card => card.decks.filter(cuid => cuid === deck.cuid)[0] === deck.cuid)}
                        key = {deck.cuid}
                    />
                ))
            }
        </div>
    );
}

DeckList.propTypes = {
    decks: PropTypes.arrayOf(PropTypes.shape({
        number: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        owner: PropTypes.string.isRequired,
        cards: PropTypes.array.isRequired,
        slug: PropTypes.string.isRequired,
        cuid: PropTypes.string.isRequired,
    })).isRequired,
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

export default DeckList;