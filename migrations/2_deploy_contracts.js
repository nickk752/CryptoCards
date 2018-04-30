const CryptoCards = artifacts.require('CryptoCardsCore');
const SkillScience = artifacts.require('SkillScienceInterface');
const SaleClockAuction = artifacts.require('SaleClockAuction');
const json = require('../client/modules/Marketplace/components/Cards.json')
const Cards = json.cards;

let core, skill;

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
      }).catch((err) => {
        console.log('err')
      })
      .then(() => {
        return core.unpause();
      })
      .then(() => {
        let promises = [];
        for (var j = 0; j < Cards.length; j++) {
          let skills = Cards[j].string;
          let name = Cards[j].name.toString();
          let str = '';
          for (var i = 0; (i < name.length && name.substr(i, 2) !== '00'); i += 2)
            str += String.fromCharCode(parseInt(name.substr(i, 2), 16));
          promises.push(core.createGen0Auction(parseInt(skills, 16), str));
        }
        Promise.all(promises)
        .then((result) => {
          console.log(result);
        })
      });
  });
};

