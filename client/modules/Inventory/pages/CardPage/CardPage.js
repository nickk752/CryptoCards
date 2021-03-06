import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { GridTile } from 'material-ui/GridList';

// Import Styles

// Import Actions
import { fetchCard } from '../../InventoryActions';

// Import Selectoes
import { getCard } from '../../CardReducer';

// Import Wang
import wang from '../../../../components/flowey.png';

export function CardPage(props) {
  return (
    <div>
      <Helmet title={props.card.name} />
      <div>
        <img src={wang} />
        <h3> {props.card.name} </h3>
        <p> Owner: {props.card.owner} </p>
        <p> TokenId: {props.card.tokenId} </p>
        <p> Type: {props.card.type} </p>
        <p> Attack: {props.card.attack} </p>
        <p> Defense: {props.card.defense} </p>
      </div>
    </div>
  );
}

// Actions required to provide data for this component to render in server side.
CardPage.need = [params => {
  return fetchCard(params.cuid);
}];

// Retrieve data from store as props
function mapStateToProps(state, props) {
  return {
    card: getCard(state, props.params.cuid),
  };
}

CardPage.propTypes = {
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

export default connect(mapStateToProps)(CardPage);
