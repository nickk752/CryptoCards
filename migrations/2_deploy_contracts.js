const CryptoCards = artifacts.require('CryptoCardsCore');
const SkillScience = artifacts.require('SkillScienceInterface');
const SaleClockAuction = artifacts.require('SaleClockAuction');

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
      })      
      .then(() => {
        return core.unpause();
      });
  });
};

