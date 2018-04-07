import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Import Components
import AuctionList from '../../components/AuctionList';

// Import Actions
import { fetchAuctions, deleteAuctionRequest, addAuctionRequest } from '../../MarketplaceActions';
// Import Selectors
import { getAuctions } from '../../MarketplaceReducer';


class MarketplacePage extends Component {
  componentDidMount() {
    this.props.dispatch(fetchAuctions());
  }

  handleDeleteAuction = auction => {
    if (confirm('Do you want to delete this auction?')) { // eslint-disable-line
      this.props.dispatch(deleteAuctionRequest(auction));
    }
  };

  handleAddAuction = (seller, card) => {
    this.props.dispatch(addAuctionRequest({ seller, card }));
  };

  render() {
    return (
      <div>
        <AuctionList auctions={this.props.auctions} />
      </div>
    );
  }
}

// Actions required to provide data for this component to render in server side.
MarketplacePage.need = [() => { return fetchAuctions(); }];

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    auctions: getAuctions(state),
  };
}

MarketplacePage.propTypes = {
  auctions: PropTypes.arrayOf(PropTypes.shape({
    seller: PropTypes.string.isRequired,
    card: PropTypes.string.isRequired,
  })).isRequired,
  dispatch: PropTypes.func.isRequired,
};

MarketplacePage.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(MarketplacePage);

