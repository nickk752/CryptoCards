import React, { PropTypes } from 'react';
import { Link } from 'react-router';

// Import Components 
import CardListItem from '../CardListItem/CardListItem';

//Import Selector
import { getCard } from '../../CardReducer';

function DeckListItem(props){
    return(
        <div>
            <Link to={{ pathname:`/inventory/deck/${props.deck.cuid}`, state: {cards: props.cards} }}>
                {props.deck.name}
            </Link>
            <div>
                {   // using cuid to get card object
                    props.cards.map(card => (
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

DeckListItem.propTypes = {
    deck: PropTypes.shape({
        number: PropTypes.number.isRequired,
        owner: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        cuid: PropTypes.string.isRequired,
        cards: PropTypes.array.isRequired,
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