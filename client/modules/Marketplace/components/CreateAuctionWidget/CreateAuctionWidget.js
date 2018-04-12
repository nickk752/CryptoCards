import React, { Component, PropTypes } from 'react';
import Web3 from 'web3';

const CoreJSON = require("../../../../../build/contracts/CryptoCardsCore.json");
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
//console.log(CoreABI.abi);
const myContract = new web3.eth.Contract(CoreJSON.abi, '0xf12b5dd4ead5f743c6baa640b0216200e89b60da', { gas: 99999999999999999999999 });


export class CreateAuctionWidget extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    myContract.methods.createGen0Auction(2000).send({
      from: '0x627306090abaB3A6e1400e9345bC60c78a8BEf57',
      gas: 99999999999999999999999
    }).on('receipt', function (receipt) {
      console.log(receipt);
    });

    myContract.methods.getCard(1).call({
      from: '0x627306090abaB3A6e1400e9345bC60c78a8BEf57'
    }).then(console.log);

  }

  render() {
    return (
      <div>
        {this.props.showCreateAuction ?
          <form onSumbit={this.handleSubmit}>
            Starting Price: <br />
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

export default CreateAuctionWidget;