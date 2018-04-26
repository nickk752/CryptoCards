import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { Card, CardMedia, CardTitle, CardText, CardAction } from 'material-ui/Card';

// import styles from '../../components/AuctionListItem/AuctionListItem.css';

import img from '../../exodia.jpg';

// Import Actions
import { fetchAuction } from '../../MarketplaceActions';

// Import Selectors
import { getAuction } from '../../MarketplaceReducer';

export function AuctionDetailPage(props) {
  return (
    <Card>
      <CardTitle title={props.auction.card} subtitle={<span>by <b>{props.auction.seller}</b></span>} />
      <CardMedia>
        <img src={img} alt="" />
      </CardMedia>
      <CardText>
        <p>Starting Price: {props.auction.startPrice} </p>
        <p>Ending Price: {props.auction.endPrice} </p>
        <p>Duration: {props.auction.duration} </p>
      </CardText>
    </Card>
  );
}

AuctionDetailPage.need = [params => {
  return fetchAuction(params.cuid);
}];

function mapStateToProps(state, props) {
  return {
    auction: getAuction(state, props.params.cuid),
  };
}

AuctionDetailPage.propTypes = {
  auction: PropTypes.shape({
    seller: PropTypes.string.isRequired,
    card: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    cuid: PropTypes.string.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps)(AuctionDetailPage);
