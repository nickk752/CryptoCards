const CryptoCards = artifacts.require('CryptoCardsCore');
const SkillScience = artifacts.require('SkillScienceInterface');
const SaleClockAuction = artifacts.require('SaleClockAuction');
const json = require('../client/modules/Marketplace/components/Cards.json')
const Cards = json.cards;

let core, skill;

function ascii2hex(text) {
  var arr = [];
  for (var i = 0, l = text.length; i < l; i++) {
    var hex = Number(text.charCodeAt(i)).toString(16);
    arr.push(hex);
  }
  var hex = arr.join('');
  var betterHex = '0x' + hex;
  return betterHex;
}


module.exports = deployer => {

  deployer.deploy(CryptoCards).then(() => {

    console.log("ADDRESS" + CryptoCards.address);

    return deployer.deploy(SaleClockAuction, CryptoCards.address, 0);
  }).then(() => {
    CryptoCards.deployed().then((instance) => {
      core = instance;
      return core.setSaleAuctionAddress(SaleClockAuction.address);
    })
      .then(() => {
        return deployer.deploy(SkillScience, 8);
      })
      .then(() => {
        SkillScience.deployed()
          .then((instance) => {
            skill = instance;
            return core.setSkillScienceAddress(skill.address);
          });
      })
      .catch((err) => {
        console.log('err')
      })
      .then(() => {
        return core.unpause();
      })
      .then(() => {
        let promises = [];
        for (var j = 0; j < Cards.length; j++) {
          let skills = Cards[j].string;
          let name = ascii2hex(Cards[j].name);
          promises.push(core.createGen0Auction(parseInt(skills, 16), name));
          console.log(name)
        }
        Promise.all(promises)
          .then((result) => {
            console.log(result);
          })
      });
  });
};

