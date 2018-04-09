/*
const CryptoCards = artifacts.require('CryptoCardsCore');
const SaleClockAuction = artifacts.require('SaleClockAuction');
let core;
module.exports = deployer => {
  deployer.deploy(CryptoCards).then(() => {
    console.log("ADDRESS" + CryptoCards.address);
    return deployer.deploy(SaleClockAuction, CryptoCards.address, 0);
  }).then(() => {
    CryptoCards.deployed().then((instance) => {
      core = instance;
      return core.setSaleAuctionAddress(SaleClockAuction.address);
    }).then((result) => {
      console.log("RESULT" );
      console.log(result);
      return core.unpause();
    }).then((result) => {
      console.log("RESULT3" );
      console.log( result);

    })
  });
};
*/

var MyContract = artifacts.require("CryptoCardsCore");
var auction = artifacts.require("SaleClockAuction");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(MyContract);
  MyContract.deployed().then(function(instance) {
    deployer.deploy(auction, instance.address, 0);
    CryptoCards.deployed().then( function(instance) {
        return instance.setSaleAuctionAddress(auction.address);
    }).then(function(instance) {
            return instance.unpause();
        })
    })
};
