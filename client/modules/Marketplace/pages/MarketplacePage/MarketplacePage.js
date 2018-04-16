import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Import Components
import AuctionList from '../../components/AuctionList';
import CreateAuctionWidget from '../../components/CreateAuctionWidget/CreateAuctionWidget';
const bid = require('../../../../util/blockchainApiCaller').bid;

// Import Actions
import { fetchAuctions, deleteAuctionRequest, addAuctionRequest, toggleCreateAuction } from '../../MarketplaceActions';
import { addCardRequest } from '../../../Inventory/InventoryActions' ;
// Import Selectors
import { getAuctions, getShowCreateAuction } from '../../MarketplaceReducer';

// Web3 
const createGen0Auctions = require('../../../../util/blockchainApiCaller').createGen0Auction;
const getAuction = require('../../../../util/blockchainApiCaller').getAuction;

class MarketplacePage extends Component {

  constructor(props) {
    super(props);
    this.handleAddAuction = this.handleAddAuction.bind(this);
   // this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(fetchAuctions());
  }

  handleDeleteAuction = auction => {
    if (confirm('Do you want to delete this auction?')) { // eslint-disable-line
      this.props.dispatch(deleteAuctionRequest(auction));
    }
  };

  handleToggleCreateAuction = () => {
    this.props.dispatch(toggleCreateAuction());
  }

  handleClick = cuid => {
    //bid();
    this.props.dispatch(deleteAuctionRequest(cuid));
    // event.preventDefault();
  }

  handleAddAuction = (seller, card, startPrice, endPrice, duration, tokenId) => {
    this.props.dispatch(addAuctionRequest({
      seller,
      card,
      startPrice,
      endPrice,
      duration,
      tokenId,
    }));
  };

  handleAddCard = () => {

  }

  handleAddGen0Auction = () => {
   /*  creating Gen 0 auctions
    this could be moved somewhere else */
    for(var i = 0; i < 10; i++){
      createGen0Auctions(i).then((result) => {
        var tokenId = result.events.Spawn.returnValues.tokenId;
        console.log('TOKEN ID CREATED: ' + tokenId);
        getAuction(tokenId).then((data) => {
          // figure out name decoding(eric)
          this.handleAddAuction(data.seller, tokenId, data.startingPrice, data.endingPrice, data.duration, tokenId);
        });  
      });
    }
  }

  render() {
    return (
      <div>
        <button onClick={this.handleAddGen0Auction}> create gen0 auctions</button>
        <br/>
        <button onClick={this.handleToggleCreateAuction}> create auction </button>
        <CreateAuctionWidget
          showCreateAuction={this.props.showCreateAuction}
          handleAddAuction={this.handleAddAuction} />
        <br />
        <br />
        <AuctionList handleClick={this.handleClick} auctions={this.props.auctions} />
      </div>
    );
  }
}

// Actions required to provide data for this component to render in server side.
MarketplacePage.need = [() => { return fetchAuctions(); }];

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    showCreateAuction: getShowCreateAuction(state),
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

