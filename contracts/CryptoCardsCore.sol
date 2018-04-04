pragma solidity ^0.4.18;

import "./CardMinting.sol";

contract CryptoCardsCore is CardMinting {
    
    // Set in case the core contract is broken and an upgrade is required
    address public newContractAddress;

    // @notice Creates the main CryptoKitties smart contract instance.
    function CryptoCardsCore() public {
        // Starts paused.
        paused = true;

        // the creator of the contract is the initial CEO
        ceoAddress = msg.sender;

        // the creator of the contract is also the intial COO
        cooAddress = msg.sender;
    }

    // @notice No tipping!
    // @dev Reject all Ether from being sent here, unless it's from one of the
    //  two auction contracts. (Hopefully, we can prevent user accidents.)
    function() external payable {
        require(
            msg.sender == address(saleAuction)
        );
    }

    // @notice Returns all the relevant info about a specific card.
    // @param _id The ID of the card of interest.
    function getCard(uint256 _id) external view returns (uint128 skills) {
        Card storage card = cards[_id];

        skills = card.skills;
    }

    // @dev Override unpause so it requires all external contract addresses
    //  to be set before contract can be unpaused. Also, we can't have
    //  newContractAddress set either, because then the contract was upgraded.
    // @notice This is public rather than external so we can call super.unpause
    //  without using an expensive CALL.
    function unpause() public onlyCEO whenPaused {
        require(saleAuction != address(0));
        require(newContractAddress == address(0));

        // Actually unpause the contract.
        super.unpause();        
    }

    // @dev Allows the CEO to capture the balance available to the contract.
    function withdrawBalance() external onlyCEO {
        uint256 balance = this.balance;

        ceoAddress.transfer(balance);
    }
}