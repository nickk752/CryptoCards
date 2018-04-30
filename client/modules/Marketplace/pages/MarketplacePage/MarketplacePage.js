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
import getWeb3 from '../../../../util/getWeb3';

import downloadMetaMask from '../../download-metamask.png';

const json = require('../../components/Cards.json');
const Cards = json.cards;

// Web3 
import {
  createGen0Auction,
  getAuction,
  getCard,
  bid,
  getCurrentPrice,
  createSaleAuction,
  ownerOf,
} from '../../../../util/blockchainApiCaller';

class MarketplacePage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      accounts: [],
    }
    this.myWeb3 = undefined;
    this.handleAddAuction = this.handleAddAuction.bind(this);
    // this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(fetchAuctions());
    // hardcoded for newGuy for now. Need to make it so it takes the cuid of the logged in user
    this.props.dispatch(fetchUserCards('newGuy'));
    let accounts;
    getWeb3((result) => {
      // console.log('getweb3');
      // console.log(result);
      this.myWeb3 = result;
    });
    if (this.myWeb3 !== undefined) {
      accounts = this.myWeb3.eth.getAccounts((error, result) => {
        if (!error) {
          return result;
        }
        return error;
      });
      accounts.then((result) => {
        this.setState({ accounts: result });
        console.log(this.state.accounts);
      });
    }
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
      console.log(this.state.accounts[0])
      bid(tokenId, result, this.state.accounts[0]).then(() => {
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

    /* var hex = '000100011300000C';
    var skills = this.hex2int(hex);
    var name = 'This is a card';
    var nameInHex = this.ascii2hex(name); */

    var skills;
    var name;
    for (var i = 0; i < Cards.length; i++) {
      skills = this.hex2int(Cards[i].string);
      name = this.ascii2hex(Cards[i].name);

      createGen0Auction(skills, name).then((result) => {
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
    createSaleAuction(tokenId, this.state.accounts[0], startingPrice, endingPrice, duration).then((result) => {
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

  ascii2hex = (text) => {
    var arr = [];
    for (var i = 0, l = text.length; i < l; i++) {
      var hex = Number(text.charCodeAt(i)).toString(16);
      arr.push(hex);
    }
    var hex = arr.join('');
    var betterHex = '0x' + hex;
    return betterHex;
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
    switch (type) {
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
        {this.state.accounts.length !== 0 ? (
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
        )
          : (<div>
            <a href="http://metamask.io"><img
              style={{
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
                width: '50%',
                height: '80%',
              }}
              src={downloadMetaMask}
              alt="downloadMetaMask"
            /></a>
            <h3 style={{textAlign: 'center'}}>Please login to MetaMask to unlock the store</h3>
          </div>)
        }
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

