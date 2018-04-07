var account_one = "c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3";

var CryptoCards = artifacts.require('../contracts/CryptoCardsCore.sol');

var cc;

CryptoCards.deployed().then(function(instance) {
    cc = instance;
    return cc.createGen0Auction(1000, {from: account_one});
}).then(function(result) {
    console.log("Transaction successful");
}).catch(function(e) {
    console.log(e);
});