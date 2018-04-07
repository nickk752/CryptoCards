var CryptoCards = artifacts.require('CryptoCardsCore');

module.exports = function (deployer) {
  deployer.deploy(CryptoCards);
};
