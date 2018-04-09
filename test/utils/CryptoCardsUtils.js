module.exports = function (CryptoCards, accounts) {
  // checks whether the expected value of totalSupply is the current value
  function checksTotalSupply(expectedValue) {
    it('totalSupply should be equal to ' + expectedValue, function (done) {
      CryptoCards.deployed().then(function (instance) {
        instance.totalSupply.call().then(function (totalSupply) {
          assert.equal(totalSupply, expectedValue
            , 'totalSupply is not equal to ' + expectedValue);
        }).then(done).catch(done);
      });
    });
  };

  function checkCardCreation(skills) {
    it('createGen0Auction should create an auction with a new card with skills ' + skills, function (done) {
      CryptoCards.deployed().then(function (instance) {
        instance.createGen0Auction(skills /*{ from: accounts[0] } */)
          .then(function (result) {
            assert.include(result.logs[0].event, 'Auction and token created', 'TokenCreated event was not triggered');
            assert.equal(result.logs[0].args.skills, skills);
          });
      }).then(done).catch(done);
    });
  };

  return {
    /** Token Details */
    checksTotalSupply: checksTotalSupply,
    checkCardCreation: checkCardCreation,
  };
};