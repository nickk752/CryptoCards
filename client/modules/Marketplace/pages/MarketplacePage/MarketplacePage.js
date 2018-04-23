import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Import Components
import AuctionList from '../../components/AuctionList';
import CreateAuctionWidget from '../../components/CreateAuctionWidget/CreateAuctionWidget';

// Import Actions
import { fetchAuctions, deleteAuctionRequest, addAuctionRequest, toggleCreateAuction } from '../../MarketplaceActions';
import { addCardRequest, transferCardRequest, fetchUserCards } from '../../../Inventory/InventoryActions';
// Import Selectors
import { getAuctions, getShowCreateAuction } from '../../MarketplaceReducer';
import { getUserCards } from '../../../Inventory/CardReducer';

// Web3 
const createGen0Auctions = require('../../../../util/blockchainApiCaller').createGen0Auction;
const getAuction = require('../../../../util/blockchainApiCaller').getAuction;
const getCard = require('../../../../util/blockchainApiCaller').getCard;
const bid = require('../../../../util/blockchainApiCaller').bid;
const getCurrentPrice = require('../../../../util/blockchainApiCaller').getCurrentPrice;
const createSaleAuction = require('../../../../util/blockchainApiCaller').createSaleAuction;
const ownerOf = require('../../../../util/blockchainApiCaller').ownerOf;

class MarketplacePage extends Component {

  constructor(props) {
    super(props);
    this.handleAddAuction = this.handleAddAuction.bind(this);
    // this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(fetchAuctions());
    // hardcoded for newGuy for now. Need to make it so it takes the cuid of the logged in user
    this.props.dispatch(fetchUserCards('newGuy'));
  }

  handleFetchUserCards = () => {
    this.props.dispatch(fetchUserCards('newGuy'));//hardcoding
  }

  handleDeleteAuction = auction => {
    if (confirm('Do you want to delete this auction?')) { // eslint-disable-line
      this.props.dispatch(deleteAuctionRequest(auction));
    }
  };

  handleToggleCreateAuction = () => {
    this.props.dispatch(toggleCreateAuction());
  }

  handleClick = (cuid, tokenId) => {
    getCurrentPrice(tokenId).then((result) => {
      console.log('BIDDING IN WEB APP, CURRENT PRICE: ');
      console.log(result);
      bid(tokenId, result).then(() => {
        console.log('FINDING NEW OWNER OF CARD');
        ownerOf(tokenId);
      });
    });
    this.props.dispatch(deleteAuctionRequest(cuid));
    this.handleTransferCard(tokenId, 'newGuy');
    this.props.dispatch(fetchUserCards('newGuy'));
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

  handleAddCard = (name, owner, type, attack, defense, decks, tokenId) => {
    this.props.dispatch(addCardRequest({
      name,
      owner,
      type,
      attack,
      defense,
      decks,
      tokenId,
    }));
  }

  handleTransferCard = (tokenId, ownerCuid) => {
    this.props.dispatch(transferCardRequest(tokenId, ownerCuid));
  }

  handleAddGen0Auction = () => {
    /*  creating Gen 0 auctions
     this could be moved somewhere else */
    var hex = '000100011300000C';
    var skills = this.hex2int(hex);
    var name = '0x504c5a20574f524b';
    console.log('SKILLS: ', skills);
    for (var i = 0; i < 3; i++) {
      createGen0Auctions(skills, name).then((result) => {
        var tokenId = result.events.Spawn.returnValues.tokenId;
        console.log('TOKEN ID CREATED: ' + tokenId);
        getAuction(tokenId).then((data1) => {
          // figure out name decoding(eric)
          getCard(tokenId).then((data2) => {
            var hexSkills = this.string2hex(data2.skills);
            console.log('SKILLS IN HEX: ' + hexSkills);
            var skillsJson = this.decodeSkills(hexSkills);
            var name = this.hex2ascii(data2.name);
            console.log('NAME FROM CARD');
            console.log(name);

            //add card 2 db
            this.handleAddCard(name, 'CryptoCardsCore', skillsJson.type, skillsJson.attack, skillsJson.defense, [], tokenId);
            //add auction 2 db
            this.handleAddAuction(data1.seller, name, data1.startingPrice, data1.endingPrice, data1.duration, tokenId);//should put card name instead of tokenId
          });
        });
      });
    }
  }

  handleCreateSaleAuction = (tokenId, startingPrice, endingPrice, duration) => {
    createSaleAuction(tokenId, startingPrice, endingPrice, duration).then((result) => {
      var tokenId = result.events.Transfer.returnValues.tokenId;
      getAuction(tokenId).then((data1) => {
        // figure out name decoding(eric)
        getCard(tokenId).then((data2) => {
          var name = this.hex2ascii(data2.name);
          //add auction 2 db
          this.handleAddAuction(data1.seller, name, data1.startingPrice, data1.endingPrice, data1.duration, tokenId);
          this.handleTransferCard(tokenId, 'CryptoCardsCore');
          this.props.dispatch(fetchUserCards('newGuy'));//hardcoding
        });
      });
    });
  }

  //work on this
  hex2int = (hex) => {
    return parseInt(hex, 16);
  }

  string2hex = (num) => {
    //getCard returns skills as a string
    var realNum = parseInt(num);
    realNum = ("000000000000000" + realNum.toString(16)).substr(-16);//this keeps leading zeros
    return realNum;
  }

  hex2ascii = (hexx) => {
    var hex = hexx.toString();
    var str = '';
    for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
  }

  decodeSkills = (skills) => {
    var skillsJson = {}
    var i = 0;
    skillsJson['attack'] = this.hex2int(skills[i + 7]);
    skillsJson['defense'] = this.hex2int(skills[i + 8]);
    //TODO: map type int to actual type names
    skillsJson['type'] = this.getType(this.hex2int(skills[i + 9]));
    skillsJson['rarity'] = this.hex2int(skills[skills.length - 1]);
    return skillsJson;
  }

  getType = (type) => {
    switch(type) {
      case 1:
        return 'Machine';
        break;
      case 2:
        return 'Augment';
        break;
      case 3:
        return 'Building';
        break;
      default:
        return 'INVALID TYPE';      
    }
  }

  render() {
    return (
      <div>
        <button onClick={this.handleAddGen0Auction}> create gen0 auctions</button>
        <br />
        <br />
        <button onClick={this.handleToggleCreateAuction}> create auction </button>
        <CreateAuctionWidget
          showCreateAuction={this.props.showCreateAuction}
          createSaleAuction={this.handleCreateSaleAuction} 
          cards={this.props.cards}
          fetchCards={this.handleFetchUserCards}
        />
        <br />
        <br />
        <AuctionList
          handleClick={this.handleClick}
          auctions={this.props.auctions} />
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
    cards: getUserCards(state, 'newGuy'),
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

