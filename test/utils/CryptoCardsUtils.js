const assert = require('assert');
const Web3 = require('Web3');
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

  function checkCardCreation(skills) {
    it('createGen0Auction should create an auction with a new card with skills ' + skills, (done) => {
      CryptoCards.deployed().then((instance) => {
        return instance.createGen0Auction(skills);
      }).then((result) => {
        // console.log('RESULT');
        // console.log(result.logs[0]);
        //assert.include(result.logs[0].event, 'Auction and token created', 'TokenCreated event was not triggered');
        assert.equal(result.logs[0].args.skills, skills);
      }).then(done).catch(done);
    });
  };


  function checkCardBid(tokenId, price) {
    it('bid should allow us to buy card tokenId: ' + tokenId, function (done) {
      let Auction;
      SaleClockAuction.deployed().then(function (instance) {
        Auction = instance;
        return Auction.bid(tokenId, {
          from: '0x890555f2b90f57eec3289f514350da04e993d2af',
          value: web3.toWei(price, 'ether'),
        });
      })
        .then(function (result) {
          // assert.include(result.logs[0].event, 'Transfer', 'Transfer event was not triggered');
          // console.log('bidresult');
          // console.log(result.logs[0].args.tokenId.c);
          // console.log(tokenId);
          assert.equal(result.logs[0].args.tokenId.c[0], tokenId);
          //assert.include(result.logs[1].event, 'CardSold', 'CardSold event was not triggered');
          //assert.equal(result.logs[1].args.tokenId.c, tokenId);
          //Confirm new contract balance
          const contractBalance = web3.fromWei(web3.eth.getBalance(Auction.address), 'ether');
          console.log('\t' + contractBalance.valueOf() + ' eth');
        })
        .then(done)
        .catch(done);
    });
  };

  function checkWithdrawal(withdrawAmount) {
    it('withdrawBalance should withdraw ' + withdrawAmount + ' eth', function (done) {
      CryptoCards.deployed().then(function (instance) {
        instance.withdrawBalance(accounts[0], web3.toWei(withdrawAmount, 'ether'), {
          from: accounts[0]
        })
          .then(function (result) {
            var contractBalance = web3.fromWei(web3.eth.getBalance(instance.address), 'ether');
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
    checkWithdrawal: checkWithdrawal
  };
};