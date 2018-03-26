import React, { PropTypes } from 'react';
import { GridList } from 'material-ui/GridList';

// Import Components
import AuctionListItem from './AuctionListItem/AuctionListItem';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: 800,
    height: 600,
    overflowY: 'auto',
  },
};

function AuctionList(props) {
  return (
    <div style={styles.root}>

      <GridList
        cellHeight={200}
        style={styles.gridList}
      >
        {
          props.auctions.map(auction => (
            <AuctionListItem
              auction={auction}
              key={auction.cuid}
            />
          ))
        }
      </GridList>
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
