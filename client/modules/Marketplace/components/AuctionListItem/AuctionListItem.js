import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { GridTile } from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
// Import Style
import styles from './AuctionListItem.css';

import img from '../../exodia.jpg';

function AuctionListItem(props) {
  return (
    <GridTile
      key={props.auction.slug}
      title={props.auction.card}
      subtitle={<span>by <b>{props.auction.seller}</b></span>}
      actionIcon={<IconButton><FontIcon className='gavel' /></IconButton>}
    >
      <img src={img} />
    </GridTile>


  //   <div className={styles['single-auction']}>
  //     <h3 className={styles['auction-title']}>
  //       <Link to={`/auctions/${props.auction.slug}-${props.auction.cuid}`} >
  //         {props.auction.card};
  //       </Link>
  //     </h3>
  //     <p className={styles['seller-name']}><FormattedMessage id="by" /> {props.auction.seller}</p>
  //     <p className={styles['card-name']}><FormattedMessage id="by" /> {props.auction.card}</p>
  //     <hr className={styles.divider} />
  //   </div>
  );
}

AuctionListItem.propTypes = {
  auction: PropTypes.shape({
    seller: PropTypes.string.isRequired,
    card: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    cuid: PropTypes.string.isRequired,
  }).isRequired,
};

export default AuctionListItem;
