import Web3 from 'web3';

const CoreJSON = require('../../build/contracts/CryptoCardsCore.json');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
//console.log(CoreABI.abi);
const myContract = new web3.eth.Contract(CoreJSON.abi, '0x345ca3e014aaf5dca488057592ee47305d9b3e10' );

module.exports = {
    createGen0Auction: function() {
    console.log('Gen 0z');
    myContract.methods.createGen0Auction(2).send({
      from: '0x627306090abaB3A6e1400e9345bC60c78a8BEf57',
      gas: 999999
    }).on('receipt', function (receipt) {
      console.log(receipt);
    });
  },

  getCard: function() {
    var retval = 'first';
    myContract.methods.getCard(0).call({
      from: '0x627306090abaB3A6e1400e9345bC60c78a8BEf57'
    }).then(function(result) {
      console.log(result);
    }
      /* (result) => {
      console.log(result);
      retval = result;
    } */
    );
    return retval;
  }
};