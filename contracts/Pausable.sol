/**
* @title Pausable
* @dev Base contract which allows children to implement an emergency stop mechanism.
*/

pragma solidity ^0.4.18;

import "./Ownable.sol";

contract Pausable is Ownable {
    event Pause();
    event Unpause();

    bool public paused = false;

    // @dev modifier to allow actions only when the contract IS NOT paused
    modifier whenNotPaused() {
        require(!paused);
        _;
    }

    // @dev modifier to allow actions only when the contract IS paused
    modifer whenPaused {
        require(paused);
        _;
    }

    // @dev called by the owner to puase. Triggers stopped state
    function pause() onlyOwner whenNotPaused returns (bool) {
        paused = true;
        Pause();
        return true;
    }

    // @dev called by the owner to unpause, returns to normal state
    function unpause() onlyOwner whenPaused returns (bool) {
        paused = false;
        Unpause();
        return true;
    }
}
