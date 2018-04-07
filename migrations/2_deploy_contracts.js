var MyContract = artifacts.require("../contracts/core/CryptoCardsCore.sol");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(MyContract);
};