import React, { Component, PropTypes } from 'react';
const createGen0Auctions = require('../../../../util/blockchainApiCaller').createGen0Auction;
const getAuction = require('../../../../util/blockchainApiCaller').getAuction;
import { fetchAuctions, addAuctionRequest } from '../../MarketplaceActions';

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
    createGen0Auctions(this.state.skills).then(() => {
      getAuction(0).then((data) => {
        alert(data);
      });
    });
    console.log("return successful");
    this.props.handleAddAuction('CryptoCards Store', 'Gen0 Card', '4', '0', '100');
    event.preventDefault();
  }

  render() {
    //createGen0Auctions();
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
