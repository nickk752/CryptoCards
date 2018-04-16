import React, { Component, PropTypes } from 'react';
const createGen0Auctions = require('../../../../util/blockchainApiCaller').createGen0Auction;
const getAuction = require('../../../../util/blockchainApiCaller').getAuction;

const apiFunctions = require('../../../../util/blockchainApiCaller');
import { fetchAuctions, addAuctionRequest } from '../../MarketplaceActions';

// testing Web.3.watch
const Web3 = require('Web3');
export const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));


export class CreateAuctionWidget extends Component {

  constructor(props) {
    super(props);
    this.state = { skills: 'aklsdfjl' };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    console.log("EVENT SUBMITTED");
    console.log(this.state.skills);
    
    /* createGen0Auctions(this.state.skills).then((result) => {
      var tokenId = result.events.Spawn.returnValues.tokenId;
      console.log('TOKEN ID CREATED: ' + tokenId);
      getAuction(tokenId).then((data) => {
        this.props.handleAddAuction(data.seller, tokenId, data.startingPrice, data.endingPrice, data.duration);
      });  
    }); */

    console.log("return successful");
    event.preventDefault();
  }

  render() {
    return (
      <div>
        {this.props.showCreateAuction ?
          <form onSubmit={this.handleSubmit}>
            Skills: <br />
            <input type="number" step=".001" name="skills" value={this.state.skills} onChange={this.handleChange} /><br />
            Ending Price: <br />
            <input type="number" step=".001" name="startingPrice" /><br />
            Ending Price: <br />
            <input type="number" step=".001" name="endingPrice" /><br />
            Duration: <br />
            <input type="number" step=".001" name="duration" /><br />
            <input type="submit" value="Submit" /><br />
          </form>
          :
          <br />
        }
      </div>
    );
  }
}

CreateAuctionWidget.propTypes = {
  handleAddAuction: PropTypes.func.isRequired,
};

export default CreateAuctionWidget;
