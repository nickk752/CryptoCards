/* const CryptoCards = artifacts.require('CryptoCardsCore');
const SaleClockAuction = artifacts.require('SaleClockAuction');
let core;
module.exports = deployer => {
  deployer.deploy(CryptoCards).then(() => {
    console.log("ADDRESS" + CryptoCards.address);
    return deployer.deploy(SaleClockAuction, CryptoCards.address, 0);
  }).then(() => {
    return CryptoCards.deployed();
  }).then((instance) => {
    core = instance;
    return core.setSaleAuctionAddress(SaleClockAuction.address);
  }).then((result) => {
    console.log("RESULT1: " );
    console.log(result);
    return core.unpause();
  }).then((result) => {
    console.log("RESULT2: " );
    console.log( result);
  });
};
 */

const CryptoCards = artifacts.require("CryptoCardsCore");
const auction = artifacts.require("SaleClockAuction");
let core;
module.exports = function (deployer) {
  // deployment steps
  deployer.deploy(CryptoCards);
  CryptoCards.deployed().then(function (instance, result) {
    deployer.deploy(auction, instance.address, 0);
    return CryptoCards.deployed()
    .then(function (instance) {
      core = instance;
      return instance.setSaleAuctionAddress(auction.address);
    }).then(function (result) {
      return core.unpause();
    })
  });
};
