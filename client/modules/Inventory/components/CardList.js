import React from 'react';
import { PropTypes } from 'prop-types';
import { GridList } from 'material-ui/GridList';
import MultiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// Import Components
import CardListItem from './CardListItem/CardListItem';
import CardAddListItem from './CardListItem/CardAddListItem';

function CardList(props){
    return(
        <div>
            <MultiThemeProvider>
                <GridList
                    cellHeight={props.height}
                    cols={props.cols}
                > 
                 
                    { props.type == 'addDeck' ?
                        props.cards.map(card => (
                            <CardAddListItem
                                card = {card}
                                deck = {props.deck}
                                key = {card.cuid}
                                addDeckToCard = {props.addDeckToCard}
                                fetchCards = {props.fetchCards}
                            />
                        ))
                        :
                        props.cards.map(card => (
                            <CardListItem
                                card = {card}
                                key = {card.cuid}
                                transferCard = {props.transferCard}
                            />
                        ))
                    }
                </GridList>
            </MultiThemeProvider>
        </div>
    );
}

CardList.propTypes = {
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

export default CardList;
