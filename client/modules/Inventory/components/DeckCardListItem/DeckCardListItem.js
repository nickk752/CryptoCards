import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { GridTile } from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

// Import styles

// Import Wang
import wang from '../../../../components/flowey.png';

function DeckCardListItem(props){

    return(
        <GridTile
            key={props.card.slug}
            title={<Link to={`/inventory/card/${props.card.cuid}`}>{props.card.name}</Link>}
            subtitle={
                <div>
                  <p> Type: {props.card.type} Att: {props.card.attack} Def: {props.card.defense} </p>
                </div>
              }
            actionIcon={
                <button onClick={() => {
                    console.log(props.card.cuid + ' removed from ' + props.deck.cuid);
                    props.removeCard(props.card.cuid, props.deck.cuid);
                }}> 
                    remove
                </button>
            }              
        >
            <img src={wang}/>
        </GridTile>
    )
}

export default DeckCardListItem;