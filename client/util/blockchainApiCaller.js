const Web3 = require('Web3');


export const web3 = new Web3(window.web3.currentProvider);

export const coreAbi = require('../../build/contracts/CryptoCardsCore.json');
export const auctionAbi = require('../../build/contracts/SaleClockAuction.json');
export const accounts = ['0x627306090abaB3A6e1400e9345bC60c78a8BEf57',
  '0xa8c53b8e680e2218a37bf2573953013d69028aeb',
  '0xcc8ae5936c1292dc91601b50f51b5d6092f8024a',
  '0x86ad239585c76862c8e1f5963280c0100c1227b3',
  '0xaf1ab6799179527202f3b906c4d6acc37bc0c12e',
  '0x66ead9b24f584cc94b39a6502d9b3ff77adb3cef',
  '0x79e60253aa662df143a73e10d234ec63a3e82f54',
  '0x536846b6a412de2057c4a52c0e5ae13c46e1ed7c',
  '0xe5164f4b0b2ea3178bcbdd14488d632a6de3ebd0',
  '0x1dd60b1d486b7ce2ee8513759fce82cf42150029'];

const CoreAddress = '0x345ca3e014aaf5dca488057592ee47305d9b3e10';
const AuctionAddress = '0xf25186b5081ff5ce73482ad761db0eb0d25abfbf';
const CryptoCardsCore = new web3.eth.Contract(coreAbi.abi, CoreAddress, {
  from: accounts[0],
  gas: '3000000',
}); // contract(abi);
const SaleClockAuction = new web3.eth.Contract(auctionAbi.abi, AuctionAddress, {
  from: accounts[0],
  gas: '3000000',
});

function ownerOf(tokenId) {
  return CryptoCardsCore.methods.ownerOf(tokenId).call().then((result) => {
    console.log('OWNER OF TOKEN ID', tokenId);
    console.log(result);
    return result;
  });
}

//Need to get it so that it sends from address of the loged in user
function createGen0Auction(skills, name) {
  return CryptoCardsCore.methods.createGen0Auction(skills, name).send({ from: accounts[0] }).then((result) => {
    console.log('CREATE GEN 0 RESULTS');
    console.log(result);
    return result;
  });
}

function createSaleAuction(tokenId, account, startingPrice, endingPrice, duration) {
  return CryptoCardsCore.methods.createSaleAuction(tokenId, startingPrice, endingPrice, duration).send({ from: account }).then((result) => {
    console.log('CREATE SALE AUCTION RESULTS');
    console.log(result);
    return result;
  });
}

function getAuction(tokenId) {
  return SaleClockAuction.methods.getAuction(tokenId).call().then((result2) => {
    console.log('GET AUCTION RESULTS');
    console.log(result2);
    return result2;
  });
}

function getCard(tokenId) {
  return CryptoCardsCore.methods.getCard(tokenId).call().then((result) => {
    console.log('GET CARD RESULTS');
    console.log(result);
    return result;
  });
}

function bid(tokenId, currentPrice, account) {
  return SaleClockAuction.methods.bid(tokenId).send({ from: account, value: currentPrice }).then((result) => {
    console.log("bid result");
    console.log(result);
    return result;
  });
}

function getCurrentPrice(tokenId) {
  return SaleClockAuction.methods.getCurrentPrice(tokenId).call().then((results) => {
    console.log("GET CURRENT PRICE: ");
    console.log(results);
    return results;
  })
}

module.exports = {
  createGen0Auction,
  createSaleAuction,
  getAuction,
  bid,
  getCard,
  getCurrentPrice,
  ownerOf,
};
