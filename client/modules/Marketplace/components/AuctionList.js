import React, { PropTypes } from 'react';

// Import Components
import AuctionListItem from './AuctionListItem/AuctionListItem';

function AuctionList(props) {
  return (
    <div className="listView">
      {
        props.auctions.map(auction => (
          <AuctionListItem
            auction={auction}
            key={auction.cuid}
          />
        ))
      }
    </div>
  );
}

AuctionList.propTypes = {
  auctions: PropTypes.arrayOf(PropTypes.shape({
    seller: PropTypes.string.isRequired,
    card: PropTypes.string.isRequired,
  })).isRequired,
};

export default AuctionList;
