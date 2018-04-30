/* const CryptoCards = artifacts.require('CryptoCardsCore');
const SaleClockAuction = artifacts.require('SaleClockAuction');
let core;
module.exports = deployer => {
  deployer.deploy(CryptoCards).then(() => {
    // console.log("ADDRESS" + CryptoCards.address);
    return deployer.deploy(SaleClockAuction, CryptoCards.address, 0);
  }).then(() => {
    return CryptoCards.deployed();
  }).then((instance) => {
    core = instance;
    return core.setSaleAuctionAddress(SaleClockAuction.address);
  }).then((result) => {
    // console.log("RESULT" + result);
    return core.unpause();
  }).then((result) => {
    // console.log("RESULT3");
    // console.log( result);

  });
}; */


const CryptoCards = artifacts.require('CryptoCardsCore');
const SkillScience = artifacts.require('SkillScience');
const SaleClockAuction = artifacts.require('SaleClockAuction');

let core, skill;

module.exports = async deployer => {

  deployer.deploy(CryptoCards).then(await async function deployCryptoCards() {

    console.log("ADDRESS" + CryptoCards.address);

    const saleInstance = await deployer.deploy(SaleClockAuction, CryptoCards.address, 0);
    const cryptoInstance = await CryptoCards.deployed();

    await cryptoInstance.setSaleAuctionAddress(saleInstance.address);

    const skillInstance = await deployer.deploy(SkillScience);
    await cryptoInstance.setSkillScienceAddress(skillInstance.address);

    await cryptoInstance.unpause();

    
  });
};
