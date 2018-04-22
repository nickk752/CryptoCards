import React, { Component, PropTypes } from 'react';
const createGen0Auctions = require('../../../../util/blockchainApiCaller').createGen0Auction;
const getAuction = require('../../../../util/blockchainApiCaller').getAuction;
const apiFunctions = require('../../../../util/blockchainApiCaller');
import { fetchAuctions, addAuctionRequest } from '../../MarketplaceActions';

//components
import CardList from '../../../Inventory/components/CardList';
import SelectCardWidget from '../../components/SelectCardWidget/SelectCardWidget';

export class CreateAuctionWidget extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      tokenId: 0,
      startingPrice: 3,
      endingPrice: 0,
      duration: 4
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log("STATE IN CREATE AUCTION WIDGET");
    console.log(this.state);

    this.props.createSaleAuction(this.state.tokenId, this.state.startingPrice, this.state.endingPrice, this.state.duration);
    //this.props.createSaleAuction(1, 1000, 100, 500000);

    console.log("return successful");
  }

  render() {
    return (
      <div>
        {this.props.showCreateAuction ?
          <div>
          <SelectCardWidget cards={this.props.cards}/>
            <form onSubmit={this.handleSubmit}>
              TokenId: <br />
              <input type="number" name="tokenId" value={this.state.tokenId} onChange={this.handleChange} /><br />
              Ending Price: <br />
              <input type="number" step=".001" name="startingPrice" value={this.state.startingPrice} onChange={this.handleChange}/><br />
              Ending Price: <br />
              <input type="number" step=".001" name="endingPrice" value={this.state.endingPrice} onChange={this.handleChange}/><br />
              Duration: <br />
              <input type="number" step=".001" name="duration" value={this.state.duration} onChange={this.handleChange}/><br />
              <input type="submit" value="Submit" /><br />
            </form>
          </div>
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
