const Web3 = require('Web3');
// const contract = require('truffle-contract');

// let reader = new FileReader();
// const coreAbi = JSON.parse()

export const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

export const coreAbi = require('../../build/contracts/CryptoCardsCore.json');
export const auctionAbi = require('../../build/contracts/SaleClockAuction.json');
export const accounts = ['0x890555f2b90f57eec3289f514350da04e993d2af',
'0xa8c53b8e680e2218a37bf2573953013d69028aeb',
'0xcc8ae5936c1292dc91601b50f51b5d6092f8024a',
'0x86ad239585c76862c8e1f5963280c0100c1227b3',
'0xaf1ab6799179527202f3b906c4d6acc37bc0c12e',
'0x66ead9b24f584cc94b39a6502d9b3ff77adb3cef',
'0x79e60253aa662df143a73e10d234ec63a3e82f54',
'0x536846b6a412de2057c4a52c0e5ae13c46e1ed7c',
'0xe5164f4b0b2ea3178bcbdd14488d632a6de3ebd0',
'0x1dd60b1d486b7ce2ee8513759fce82cf42150029'];

function createGen0Auction(skills) {
  

  
  const CoreAddress = '0xa8e24c545b30a30b85e03397556d5aab603fe4ca';
  const AuctionAddress = '0x5216da59290aa93b4152602a350dfec16e37933a';
  const CryptoCardsCore = new web3.eth.Contract(coreAbi.abi, CoreAddress, {
    from: accounts[0],
    gas: '4600000',
  }); // contract(abi);
  const SaleClockAuction = new web3.eth.Contract(auctionAbi.abi, AuctionAddress, {
    from: accounts[0],
    gas: '4600000',
  });
  console.log(CryptoCardsCore);
  CryptoCardsCore.methods.createGen0Auction(skills).send({ from: accounts[0] }).then((result) => {
    console.log('results1');
    console.log(result);
    return SaleClockAuction.methods.getAuction(0).call().then((result2) => {
      console.log('results2');
      console.log(result2.duration);
      return result2;
    })
  });
  // web3.eth.getBlock("latest", (error, result) => {
  //   console.log('error:', error);
  //   console.log('results', result);
  // });

}

function bid() {
  const coreAbi = require('../../build/contracts/CryptoCardsCore.json');
  const auctionAbi = require('../../build/contracts/SaleClockAuction.json');
  // const web3;
  // if (typeof web3 !== 'undefined') {
  //   web3 = new Web3(web3.currentProvider);
  // } else {
  // set the provider you want from Web3.providers
  const accounts = ['0x890555f2b90f57eec3289f514350da04e993d2af',
    '0xa8c53b8e680e2218a37bf2573953013d69028aeb',
    '0xcc8ae5936c1292dc91601b50f51b5d6092f8024a',
    '0x86ad239585c76862c8e1f5963280c0100c1227b3',
    '0xaf1ab6799179527202f3b906c4d6acc37bc0c12e',
    '0x66ead9b24f584cc94b39a6502d9b3ff77adb3cef',
    '0x79e60253aa662df143a73e10d234ec63a3e82f54',
    '0x536846b6a412de2057c4a52c0e5ae13c46e1ed7c',
    '0xe5164f4b0b2ea3178bcbdd14488d632a6de3ebd0',
    '0x1dd60b1d486b7ce2ee8513759fce82cf42150029']
  const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  // }
  
  const CoreAddress = '0xa8e24c545b30a30b85e03397556d5aab603fe4ca';
  const AuctionAddress = '0x5216da59290aa93b4152602a350dfec16e37933a';
  const AuctionContract = new web3.eth.Contract(auctionAbi.abi, AuctionAddress, {
    from: accounts[0],
    gas: '46000000',
  }); // contract(abi);
  AuctionContract.methods.bid(0).send({ from: accounts[0] }).then((result) => {
    console.log("bid result");
    console.log(result);
  });
}

module.exports = {
  createGen0Auction,
  bid,
}



