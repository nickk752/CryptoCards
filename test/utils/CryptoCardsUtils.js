
const assert = require('assert');

// Web3 stuff
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

module.exports = function (CryptoCards, SaleClockAuction) {
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