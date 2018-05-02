import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { GridTile } from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import { imageGetter } from '../../../../util/imageGetter';

// Import styles

// Import Wang
import wang from '../../../../components/flowey.png';

function DeckCardListItem(props) {

  return (
    <GridTile
      key={props.card.slug}
      title={props.card.name}
      subtitle={
        <div>
          <p> Type: {props.card.type} Att: {props.card.attack} Def: {props.card.defense} </p>
        </div>
      }
      actionIcon={
        <button
          onClick={() => {
            console.log(props.card.cuid + ' removed from ' + props.deck.cuid);
            props.removeCard(props.card.cuid, props.deck.cuid);
          }}>
          remove
        </button>
      }
    >
      <img src={imageGetter(props.card.tokenId)} />
    </GridTile>
  )
}

export default DeckCardListItem;