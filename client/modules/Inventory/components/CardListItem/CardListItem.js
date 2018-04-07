import React from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { GridTile } from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

// Import styles

// Import Wang
import wang from '../../../../components/wang.jpg';

<<<<<<< HEAD
function CardListItem(props){
    return(
        
        <Link to={`/inventory/card/${props.card.cuid}`}>
            <GridTile
                key={props.card.slug}
                title={props.card.name}
                subtitle={props.card.type}
                //find way to display attack and 
            >
                <img src={wang}/>
            </GridTile>
        </Link>
        
    );
=======
function CardListItem(props) {
  return (

    <Link to={`/inventory/card/${props.card.cuid}`}>
      <GridTile
        key={props.card.slug}
        title={props.card.name}
        subtitle={props.card.type}
      // find way to display attack and 
      >
        <img src={wang} role="presentation" />
      </GridTile>
    </Link>

    /*
     <div>
         <h3>
             <Link to={`/inventory/card/${props.card.cuid}`}>
                 {props.card.name}
             </Link>
         </h3>
         <p> Owner: {props.card.owner} </p>
         <p> Type: {props.card.type} </p>
         <p> Attack: {props.card.attack} </p>
         <p> Defense: {props.card.defense} </p>
     </div>
     */
  );
>>>>>>> 9c2b121098fb33e456d23abdb51b11854baa671e
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
