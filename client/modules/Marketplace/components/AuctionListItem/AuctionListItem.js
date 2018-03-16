import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';

// Import Style
import styles from './AuctionListItem.css';

function AuctionListItem(props) {
  return (
    <div className={styles['single-auction']}>
      <h3 className={styles['auction-title']}>
        <Link to={`/auctions/${props.auction.slug}-${props.auction.cuid}`} >
          {props.auction.card};
        </Link>
      </h3>
      <p className={styles['seller-name']}><FormattedMessage id="by" /> {props.auction.seller}</p>
      <p className={styles['card-name']}><FormattedMessage id="by" /> {props.auction.card}</p>
      <hr className={styles.divider} />
    </div>
  );
}

AuctionListItem.propTypes = {
  auction: PropTypes.arrayOf(PropTypes.shape({
    seller: PropTypes.string.isRequired,
    card: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    cuid: PropTypes.string.isRequired,
  })).isRequired,
};

export default AuctionListItem;
