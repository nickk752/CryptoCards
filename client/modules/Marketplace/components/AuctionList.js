import React, { PropTypes } from 'react';
import { GridList } from 'material-ui/GridList';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
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
      <MuiThemeProvider>
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
      </MuiThemeProvider>
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
