module.exports = function (CryptoCards, accounts) {
  // checks whether the expected value of totalSupply is the current value
  function checksTotalSupply (expectedValue) {
    it('totalSupply should be equal to ' + expectedValue, function (done) {
      CryptoCards.deployed().then(function (instance) {
        instance.totalSupply.call().then(function (totalSupply) {
        assert.equal(totalSupply, expectedValue
          , 'totalSupply is not equal to ' + expectedValue);
        }).then(done).catch(done);
      });
    });
  };

  function checkCardCreation (skills) {
    it('createGen0Auction should create an auction with a new card with skills ' + skills, function (done) {
      CryptoCards.deployed().then(async function (instance) {
        await instance.createGen0Auction(skills, { from: accounts[0] })
        .then(function (result) {
          assert.include(result.logs[0].event, 'Auction and token created', 'TokenCreated event was not triggered');
          assert.equal(result.logs[0].args.skills, skills);
        });
      }).then(done).catch(done);
    });
  };

  /*function checkCardExists (tokenId) {
    it('getCard should return skills of card with id: ' + tokenId, function (done) {
      CryptoCards.deployed().then(async function (instance) {
        await instance.getCard(tokenId)
        .then(function (result) {
          assert.include(result.logs[0].event, 'Auction and token created', 'TokenCreated event was not triggered');
          assert.equal(result.logs[0].args.skills, skills);
        });
      }).then(done).catch(done);
    });
  };

  function checkWithdrawal (withdrawAmount) {
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
  };*/

  return {
  /** Token Details */
    checksTotalSupply: checksTotalSupply,
    checkCardCreation: checkCardCreation
  };
};
