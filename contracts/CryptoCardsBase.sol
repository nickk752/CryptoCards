pragma solidity ^0.4.18;

import "./AccessControl.sol";
import "./SaleClockAuction.sol";

contract CryptoCardsBase is AccessControl {

    /*** EVENTS ***/

    // @dev The spawn event is fired whenever a new card is minted
    event Spawn(address owner, uint256 tokenId, uint128 skills);

    // @dev Transfer event as defined in current draft of ERC721. Emitted evry time a 
    //  card ownership is assigned, including minting
    event Tranfer(address from, address to, uint256 tokenId);

    /*** DATA TYPES ***/

    // @dev The main Card struct. Every card in CryptoCards is represented by a copy
    //  of this structure.
    // WORK IN PROGRESS
    struct Card {
        // @dev Placeholder/potentially valid variable to store relvant card info
        uint128 skills;
    }

    /*** CONSTANTS ***/
    // -- Don't have any of these yet -- //

    /*** STORAGE ***/

    // @dev An array containing the Card struct for cards in existence. The ID
    //  of each card is an index into this array. 
    Card[] cards;

    // @dev A mapping from card IDs to the address that owns them. All cards have
    //  some valid owner address.
    mapping (uint256 => address) public cardIndexToOwner;

    // @dev A mapping from owner address to count of tokens that address owns.
    //  Used internally inside balanceOf() to resolve ownership count.
    mapping (address => uint256) ownershipTokenCount;

    // @dev A mapping from card IDs to an address that has been approved to call
    //  transferFrom(). Each card can only have one approved address for transfer
    //  at any time. A zero value means no approval is outstanding.
    mapping (uint256 => address) public cardIndexToApproved;

    // @dev The addrress of a custom ClockAuction that handles sales of Cards. This
    //  will handle peer-to-peer sales as well as the gen0 sales
    SaleClockAuction public saleAuction;

    // @dev Assigns ownership of a specific Card to an address
    function _tranfer(address _from, address _to, uint256 _tokenId) internal {
        // Increase ownershipTokenCount of address receiving card
        ownershpTokenCount[_to]++;
        // Transfer ownership.
        kittyIndexToOwner[_tokenId] = _to;
        // Additional accounting. Newly minted cards 'from' address would be zero
        // so check for that first
        if (_from != address(0)) {
            ownershipTokenCount[_from]--;
        }
        // Emit the transfer event.
        Transfer(_from, _to, _tokenId);
    }

    // @dev An internal method that creates a new card and stores it. This
    //   method doesn't do any checking and should only be called when the
    //   input data is known to be valid. Will generate a Spawn event 
    //   and a Transfer event.
    // @param _skills contains crucial info about card
    // @param _owner The initial owner of this card, must be nonzero
    function _createCard(uint128 _skills, address _owner) internal returns(uint256) {
        Card memory _card = Card({
            skills: _skills
        });
        uint256 newCardId = cards.push(_card) - 1;

        // emit the Spawn event
        Spawn(_owner, newCardId, _card.skills);

        // This will assign ownership, and also emit the Transfer event as 
        // per ERC721 draft
        _transfer(0, _owner, newCardId);

        return newCardId;
    }
}