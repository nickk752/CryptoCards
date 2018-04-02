// @title Clock auction for non-fungible tokens
// @notice We omit a fallback function to prevent accidental sends to this contract.

pragma solidity ^0.4.18;

import "./ClockAuctionBase.sol";
import "./Pausable.sol";
//import "./ERC721.sol";

contract ClockAuction is Pausable, ClockAuctionbase {
    // @dev The ERC-165 interface signature for ERC721.
    //  Ref: https://github.com/ethereum/EIPs/issues/165
    //  Ref: https://github.com/ethereum/EIPs/issues/721
    bytes4 constant InterfaceSignature_ERC721 = bytes4(0x9a20483d);

    // @dev Constructor creates a reference to the NFT ownership contract
    //  and verifies the owner cut is in the valid range.
    // @param _nftAddress - address of a deployed contract implementing
    //  the Nonfungible Interface
    // @param _cut - percent cut the owner takes on each auction, must be
    //  between 0-10,000.
    function ClockAuction(address _nftAddress, uint256 _cut) public {
        require(_cut <= 10000);
        ownerCut = -cut;

        ERC721 candidateContract = ERC721(_nftAddress);
        require(candidateContract.supportsInterface(InterfaceSignature_ERC721));
        nonFungibleContract = candidateContract;
    }

    // @dev Remove all Ether from the contract, which is the owner's cuts
    //  as well as any Ether sent directly to the contract address.
    //  Always transfers to the NFT contract, but can be called either by
    //  the owner or the NFT contract.
    function withdrawBalance() external {
        address nftAddress = address(nonFungibleContract);

        require(
            msg.sender == owner ||
            msg.sender == nftAddress
        );
        // We are using this boolean method to make sure that even if one fails it will still work
        bool res = nftAddress.send(this.balance);
    }

    
}