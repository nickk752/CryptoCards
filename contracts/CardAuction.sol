pragma solidity ^0.4.18;

import "./CardOwnership.sol";

contract CardAuction is CardOwnership {
    // @notice The auction contract variables are defined in CryptoCardsBase to allow
    //  us to refer to them in CardOwnership to prevent accidental transfers.
    
    // @dev Sets the reference to the sale auction.
    // @param _address - Address of sale contract.
    function setSaleAuctionAddress(address _address) external onlyCEO {
        SaleClockAuction candidateContract = SaleClockAuction(_address);

        // NOTE: Verify that a contract is what we expect
        require(candidateContract.isSaleClockAuction());

        // Set the new contract address
        saleAuction = candidateContract;
    }

    // @dev Put a kitty up for auction.
    //  Does some ownership trickery to create auctions in one tx.
    function createSaleAuction(
        uint256 _cardId,
        uint256 _startingPrice,
        uint256 _endingPrice,
        uint256 _duration
    )
        external
        whenNotPaused
    {
        // Auction contract checks input sizes
        // If card is already on any auction, this will throw
        // becuase it will be owned by the auction contract.
        require(_owns(msg.sender, _cardId));
        _approve(_cardId, saleAuction);
        // Sale auction throws if inputs are invalid and clears
        // transfer approval after escrowing the card
        saleAuction.createAuction(
            _cardId,
            _startingPrice,
            _endingPrice,
            _duration,
            msg.sender
        );
    }
}