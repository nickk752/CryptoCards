import React from 'react';
import { PropTypes } from 'prop-types';
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
            handleClick={props.handleClick}
            auction={auction}
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
  handleClick: PropTypes.func.isRequired,
};

export default AuctionList;
