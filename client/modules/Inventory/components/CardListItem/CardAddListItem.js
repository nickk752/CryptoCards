import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { GridTile } from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

// Import styles

// Import Wang
import wang from '../../../../components/wang.jpg';

function CardAddListItem(props){
    
    
    return(
        <GridTile
            key={props.card.slug}
            title={props.card.name}
            subtitle={
                <div>
                  <p> Type: {props.card.type} Att: {props.card.attack} Def: {props.card.defense} </p>
                </div>
              }
            onClick={() => {
                alert(props.card.cuid + ' added to ' + props.deck.cuid);
                props.addDeckToCard(props.card.cuid, props.deck.cuid);
                props.fetchCards();
                }
            }
            //find way to display attack and 
        >
            <img src={wang}/>
        </GridTile>
    );
}

CardAddListItem.propTypes = {
    card: PropTypes.shape({
        name: PropTypes.string.isRequired,
        owner: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        attack: PropTypes.string.isRequired,
        defense: PropTypes.string.isRequired,
        slug: PropTypes.string.isRequired,
        cuid: PropTypes.string.isRequired,
    }).isRequired,
};

export default CardAddListItem;