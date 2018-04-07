pragma solidity ^0.4.18;

import "./CardAuction.sol";

contract CardMinting is CardAuction {

    // Constants for gen0 auctions.
    uint256 public constant GEN0_STARTING_PRICE = 10 finney;
    uint256 public constant GEN0_AUCTION_DURATION = 1 days;

    // Counts the number of cards the contract owner has created.
    uint256 public gen0CreatedCount;

    // @dev Creates a new gen0 card with the given skills and
    //  creates an auction for it.
    function createGen0Auction(uint128 _skills) external onlyCLevel {
        uint256 cardId = _createCard(_skills, address(this));
        _approve(cardId, saleAuction);

        saleAuction.createAuction(
            cardId,
            _computeNextGen0Price(),
            0,
            GEN0_AUCTION_DURATION,
            address(this)
        );

        gen0CreatedCount++;
    }

    // @dev Computes the next gen0 auction starting price, given
    //  the average of the past 5 prices + 50%
    function _computeNextGen0Price() internal view returns (uint256) {
        uint256 avePrice = saleAuction.averageGen0SalePrice();

        // Sanity check to ensure we don't overflow arithmetic
        require(avePrice == uint256(uint128(avePrice)));

        uint256 nextPrice = avePrice + (avePrice / 2);

        // We never auction for less than starting price
        if (nextPrice < GEN0_STARTING_PRICE) {
            nextPrice = GEN0_STARTING_PRICE;
        }

        return nextPrice;
    }
}