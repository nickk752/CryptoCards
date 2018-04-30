const Web3 = require('web3');


export const web3 = new Web3(typeof window !== 'undefined' ? window.web3.currentProvider : new Web3.providers.HttpProvider('http://localhost:8545'));

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

function hex2int(hex) {
  return parseInt(hex, 16);
}

function getType(type) {
  switch (type) {
    case 1:
      return 'Machine';
      break;
    case 2:
      return 'Augment';
      break;
    case 3:
      return 'Building';
      break;
    default:
      return 'INVALID TYPE';
  }
}

function decodeSkills(skills) {
  var skillsJson = {};
    var i = 0;
    skillsJson['lcost'] = this.hex2int(skills[i + 4]);
    skillsJson['mcost'] = this.hex2int(skills[i + 5]);
    skillsJson['rcost'] = this.hex2int(skills[i + 6]);
    skillsJson['attack'] = this.hex2int(skills[i + 7]);
    skillsJson['defense'] = this.hex2int(skills[i + 8]);
    skillsJson['type'] = this.getType(this.hex2int(skills[i + 9]));
    //traits stay a as a hex string
    skillsJson['trait1'] = skills[i + 10];
    skillsJson['trait2'] = skills[i + 11];
    skillsJson['trait3'] = skills[i + 12];
    //description stays hex string too
    skillsJson['description'] = skills[i + 13] + skills[i + 14];
    skillsJson['rarity'] = this.hex2int(skills[skills.length - 1]);
    return skillsJson;
}

function hex2ascii(hexx) {
  var hex = hexx.toString();
  var str = '';
  for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

function string2hex(num) {
  // getCard returns skills as a string
  let realNum = parseInt(num);
  realNum = ("000000000000000" + realNum.toString(16)).substr(-16);//this keeps leading zeros
  return realNum;
}

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

async function getCard(tokenId) {
  const card = await CryptoCardsCore.methods.getCard(tokenId).call();
  const owner = await CryptoCardsCore.methods.ownerOf(tokenId);
  
  const isCombining = card.isCombining; // bool: Whether card is pregerz er nawt
  const isReady = card.isReady;   // bool: Whether card is ready to get down or not
  const cooldownIndex = card.cooldownIndex.toNumber(); // int: index into cooldown array
  const nextActionAt = card.nextActionAt.toNumber(); // int: block number when card will be done pregerz and dtf agayne
  const combiningWithId = card.combiningWithId.toNumber(); // int: the 'father' if card is pregnant, 0 otherwise
  const spawnTime = card.spawnTime.toNumber(); // int: seconds since epoch
  const firstIngredientId = card.firstIngredientId.toNumber(); // int: parent1 tokenId
  const secondIngredientId = card.secondIngredientId.toNumber(); // int: parent2 tokenId
  const generation = card.generation.toNumber(); // int: generation of the card
  
  const hexSkills = string2hex(card.skills);
  console.log('SKILLS IN HEX: ' + hexSkills);
  const { type, attack, defense } = decodeSkills(hexSkills);
  const name = hex2ascii(card.name);
  console.log('NAME FROM CARD');
  console.log(card.name)
  console.log(name);
  return {
    name,
    owner,
    type,
    attack,
    defense,
    decks: [],
    tokenId,
    isCombining,
    isReady,
    cooldownIndex,
    nextActionAt,
    combiningWithId,
    spawnTime,
    firstIngredientId,
    secondIngredientId,
    generation,
  };
}

async function getAuction(tokenId) {
  const auction = await SaleClockAuction.methods.getAuction(tokenId).call();
  const card = await getCard(tokenId);
  console.log('getaucion card')
  //console.log(card)
  //console.log(auction)
  return {
    seller: auction.seller,
    card: card.name,
    startPrice: auction.startingPrice,
    endPrice: auction.endingPrice,
    duration: auction.duration,
    tokenId,
  };
}

async function getAuctions() {
  const supply = await CryptoCardsCore.methods.totalSupply().call();
  let owner;
  let auctions = [];
  let i;
  for (i = 0; i < supply; i++) {
    owner = await CryptoCardsCore.methods.ownerOf(i).call();
    if (owner.toUpperCase() === AuctionAddress.toUpperCase()) {
      const auction = await getAuction(i);
      auctions.push(auction);
    }
  }
  // console.log(auctions);
  return auctions;
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
  getAuctions,
  bid,
  getCard,
  getCurrentPrice,
  ownerOf,
};
