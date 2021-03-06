import React from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router';
import { GridTile } from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
// import Image from 'react-bootstrap/lib';


// Import Style
// import styles from './AuctionListItem.css';

import img from '../../flowey.svg';

import imageGetter from '../../../../util/imageGetter';

const styles = {
  imgWrap: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0',
  },
};


function AuctionListItem(props) {
  const image = imageGetter(Math.floor(Math.random() * 100));
  return (
    <GridTile
      key={props.auction.slug}
      title={<Link to={`/marketplace/${props.auction.cuid}`} >{props.auction.card}</Link>}
      subtitle={<span>by <b>{props.auction.seller}</b></span>}
      actionIcon={<button onClick={() => props.handleClick(props.auction.cuid, props.auction.tokenId)}>Bid!</button>}
    >
      <div style={styles.imgWrap}>
        <img style={{position: 'absolute'}} src={image} role="presentation" />
      </div>
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
  handleClick: PropTypes.func.isRequired,
};

export default AuctionListItem;
