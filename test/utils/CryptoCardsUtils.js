
const assert = require('assert');

const BigNumber = require('bignumber.js');
const Web3 = require('Web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const accounts = ["0x4d4e1ad0f5bb358c76171e697c95da1d406c1096",
  "0x40a754066dc038d2cda081be4becfbf35a63dc7e",
  "0xc4a22e17f361b22d96f041f0c9b282ce616e92d3",
  "0x2357993658273797e2a41231dc370939d46ab37c",
  "0x7b19852d37675978d43e788024dc96901e6b716d",
  "0x678403e07fb2e10c21f08070387c2827d5c13db0",
  "0x579d591a4cb469288b868ca68aaedd36d1b45a5e",
  "0x3d3c0f287a35409dbae695516f666b3d528fe476",
  "0x0a652131def23151859340dcfc0c84dc53bb6e77",
  "0x4ad3c9d222043e219901353bf1a0cdbef4570c68"];

module.exports = function (CryptoCards, SaleClockAuction) {
  let auction, core;
  let card1, card2;
  const deploy = async function (cut = 0) {
    
      core = await CryptoCards.new();
      auction = await SaleClockAuction.new(core.address, cut, { from: owner });

      await core.createGen0Auction('0123');
      await core.createGen0Auction('0123');
      card1 = await core.getCard(0);
      card2 = await core.getCard(1);
  }
  // checks whether the expected value of totalSupply is the current value
  function checksTotalSupply(expectedValue) {
    it('totalSupply should be equal to ' + expectedValue, (done) => {
      CryptoCards.deployed().then(function (instance) {
        instance.totalSupply.call().then(function (totalSupply) {
          assert.equal(totalSupply, expectedValue
            , 'totalSupply is not equal to ' + expectedValue);
        }).then(done).catch(done);
      });
    });
  }

  function checkCardCreation(skills, name) {
    it('createGen0Auction should create an auction with a new card with skills ' + skills, (done) => {
      CryptoCards.deployed().then((instance) => {
        return instance.createGen0Auction(skills, name);
      }).then((result) => {
         /* console.log('RESULT');
         console.log(result.logs[0]);
         console.log(result.logs[0].args.name); */
        //assert.include(result.logs[0].event, 'Auction and token created', 'TokenCreated event was not triggered');
        assert.equal(result.logs[0].args.skills, skills);
      }).then(done).catch(done);
    });
  };


  function checkCardBid(tokenId, price) {
    it('bid should allow us to buy card tokenId: ' + tokenId, async function() {
      try {
        var Auction = await SaleClockAuction.deployed();
        var core = await CryptoCards.deployed();
        var auctionEvent = Auction.AuctionSuccessful();
        var result = await Auction.bid(tokenId, {
          from: '0x627306090abaB3A6e1400e9345bC60c78a8BEf57',
          value: price,
        });
      
        var logTokenId = result.logs[0].args.tokenId.c[0];
        // console.log(result);
        assert.equal(logTokenId, tokenId, 'logTokenId is not equal to' + tokenId);
        var contractBalance = await web3.eth.getBalance(core.address);
        console.log('Contract balance:' + contractBalance + ' wei');
      } catch(err) {
        console.log(err);
      }
  },
  function checkCardBid(tokenId, price) {
    it('bid should allow us to buy card tokenId: ' + tokenId, function (done) {
      let Auction;
      SaleClockAuction.deployed().then(function (instance) {
        Auction = instance;
        console.log('prebid')
        //console.log(Auction);
        return Auction.bid(tokenId, {
          from: '0x4d4e1ad0f5bb358c76171e697c95da1d406c1096',
          value: price,
        });
      })
        .then(function (result) {
          console.log('postbid')
          console.log(result);
          // assert.include(result.logs[0].event, 'Transfer', 'Transfer event was not triggered');
          // console.log('bidresult');
          // console.log(result.logs[0].args.tokenId.c);
          // console.log(tokenId);
          assert.equal(result.logs[0].args.tokenId.c[0], tokenId);
          //assert.include(result.logs[1].event, 'CardSold', 'CardSold event was not triggered');
          //assert.equal(result.logs[1].args.tokenId.c, tokenId);
          //Confirm new contract balance
          return web3.eth.getBalance(Auction.address);
        })
        .catch(() => {
          console.log('biderror');
        })
        .then((result) => {
          const contractBalance = web3.utils.fromWei(new BigNumber(result), 'ether');          
          console.log('\t' + contractBalance.valueOf() + ' eth');
        })
        .catch(done);
    });
  };

  function checkAuctionCreation(tokenId, startingPrice, endingPrice, duration) {
    it('Account should be able to make auction for tokenId: ' + tokenId, async function() {
      try{
        var Auction = await SaleClockAuction.deployed();
        var core = await CryptoCards.deployed();
        var result = await core.createSaleAuction(tokenId, startingPrice, endingPrice, duration, {
          from: '0x627306090abaB3A6e1400e9345bC60c78a8BEf57',
        });
        console.log(result);
        assert.equal(3, tokenId);
      } catch(err) {
        console.log(err);
      }  
    });
  }

  function checkWithdrawal(withdrawAmount) {
    it('withdrawBalance should withdraw ' + withdrawAmount + ' wei', function (done) {
      CryptoCards.deployed().then(async function (instance) {
        var prior = await web3.eth.getBalance(instance.address);
        console.log('priorBal:');
        console.log(prior);
        instance.withdrawBalance('0x627306090abaB3A6e1400e9345bC60c78a8BEf57', withdrawAmount, {
          from: '0x627306090abaB3A6e1400e9345bC60c78a8BEf57'
        })
          .then(function (result) {
            var contractBalance = web3.utils.toWei(web3.eth.getBalance(instance.address));
            console.log(contractBalance);
            console.log(withdrawAmount);
            assert.equal(contractBalance, 0.0);
          });
      }).then(done).catch(done);
    });
  };

  return {
    /** Card Details */
    checksTotalSupply: checksTotalSupply,
    checkCardCreation: checkCardCreation,
    checkCardBid: checkCardBid,
    checkWithdrawal: checkWithdrawal,
    checkAuctionCreation: checkAuctionCreation,
  };
};