import React from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router';
import { GridTile } from 'material-ui/GridList';

// Import styles

// Import Wang
import wang from '../../../../components/wang.jpg';

function CardListItem(props) {
  
  return (
    <GridTile
      key={props.card.slug}
      title={<Link to={`/inventory/card/${props.card.cuid}`}>{props.card.name}</Link>}
      subtitle={
        <div>
          <p> Type: {props.card.type} Att: {props.card.attack} Def: {props.card.defense} </p>
        </div>
      }
    //find way to display attack and 
    >
      <img src={wang} />
    </GridTile>
    );
}

CardListItem.propTypes = {
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

export default CardListItem;
