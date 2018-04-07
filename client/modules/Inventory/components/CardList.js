import React from 'react';
import { PropTypes } from 'prop-types';
import { GridList } from 'material-ui/GridList';
import MultiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// Import Components
import CardListItem from './CardListItem/CardListItem';

function CardList(props){
    return(
        <div>
            <MultiThemeProvider>
                <GridList
                    cellHeight={300}
                    cellWidth={200}
                    cols={4}
                >
                    {
                        props.cards.map(card => (
                            <CardListItem
                                card = {card}
                                key = {card.cuid}
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
