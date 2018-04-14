pragma solidity ^0.4.18;

contract ERC721 {
    // Required methods
    function totalSupply() public view returns (uint256 total);
    function balanceOf(address _owner) public view returns (uint256 balance);
    function ownerOf(uint256 _tokenId) external view returns (address owner);
    function approve(address _to, uint256 _tokenId) external;
    function transfer(address _to, uint256 _tokenId) external;
    function transferFrom(address _from, address _to, uint256 _tokenId) external;

    // Events
    event Transfer(address from, address to, uint256 tokenId);
    event Approval(address owner, address approved, uint256 tokenId);

    // Optional
    // function name() public view returns (string name);
    // function symbol() public view returns (string symbol);
    // function tokensOfOwner(address _owner) external view returns (uint256[] tokenIds);
    // function tokenMetadata(uint256 _tokenId, string _preferredTransport) public view returns (string infoUrl);

    // ERC-165 Compatibility (https://github.com/ethereum/EIPs/issues/165)
    function supportsInterface(bytes4 _interfaceID) external view returns (bool);
}

/**
* @title Ownable
* @dev The Ownable contract has an owner address, and provides basic authorization control
*  functions, this simplifies the implementation of "user permissions".
*/
contract Ownable {
    address public owner;

    // @dev The Ownable constructor sets the original 'onwer' of the contract to the sender
    //  account
    function Ownable() {
        owner = msg.sender;
    }

    // @dev Throws if called by any account other than the owner.
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    // @dev Allows the current owner to transfer control of the contract to a newOwner.
    // @param newOwner The address to transfer ownership to.
    function transferOwnership(address newOwner) onlyOwner {
        if (newOwner != address(0)) {
            owner = newOwner;
        }
    }
}

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
    modifier whenPaused {
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

contract ClockAuctionBase {
    // Represents an auction on an NFT
    struct Auction {
        // Current owner of NFT
        address seller;
        // Price (in wei) at beginning of auction
        uint128 startingPrice;
        // Price (in wei) at end of auction
        uint128 endingPrice;
        // Duration (in seconds) of auction
        uint64 duration;
        // Time when auction started
        // NOTE: 0 if this auction has been concluded
        uint64 startedAt;
    }

    // Reference to contract tracking NFT ownership
    ERC721 public nonFungibleContract;

    // Cut owner takes on each auction, measured in basis points (1/100 of a percent).
    // Values 0-10,000 map to 0%-100%
    uint256 public ownerCut;

    // Map from token ID to their corresponding auction.
    mapping (uint256 => Auction) tokenIdToAuction;

    event AuctionCreated(uint256 tokenId, uint256 startingPrice, uint256 endingPrice, uint256 duration);
    event AuctionSuccessful(uint256 tokenId, uint256 totalPrice, address winner);
    event AuctionCancelled(uint256 tokenId);

    // @dev Returns true if the claimant owns the token.
    // @param _claimant - Address caliming to own the token.
    // @param _tokenId - ID of token whose ownership needs to be verified
    function _owns(address _claimant, uint256 _tokenId) internal view returns (bool) {
        return(nonFungibleContract.ownerOf(_tokenId) == _claimant);
    }

    // @dev Escrows the NFT, assigning ownership to this contract.
    //  Throws if the escrow fails.
    // @param _owner - Current owner address of token to escrow.
    // @param _tokenId - ID of token whose approval to verify
    function _escrow(address _owner, uint256 _tokenId) internal {
        // it will throw if transfer fails
        nonFungibleContract.transferFrom(_owner, this, _tokenId);
    }

    // @dev Transfers an NFT owned by this contract to another address.
    //  Returns true if the transfer succeeds
    // @param _receiver - Address to transfer NFT to.
    // @param _tokenId - ID of token to transfer.
    function _transfer(address _receiver, uint256 _tokenId) internal {
        // it will throw if transfer fails
        nonFungibleContract.transfer(_receiver, _tokenId);
    }

    // @dev Adds an auction to the list of open auctions. Also fires the 
    //  AuctionCreated event
    // @param _tokenId - The ID of the token to be put on the auctioin.
    // @param _auction - Auction to add.
    function _addAuction(uint256 _tokenId, Auction _auction) internal {
        // Require that all auctions have a duration of
        // at least one minute. (Keeps our math from getting hairy!)
        require(_auction.duration >= 1 minutes);

        tokenIdToAuction[_tokenId] = _auction;

        AuctionCreated(
            uint256(_tokenId),
            uint256(_auction.startingPrice),
            uint256(_auction.endingPrice),
            uint256(_auction.duration)
        );
    }

    // @dev Cancels an auction unconditionally.
    function _cancelAuction(uint256 _tokenId, address _seller) internal {
        _removeAuction(_tokenId);
        _transfer(_seller, _tokenId);
        AuctionCancelled(_tokenId);
    }

    // @dev Computes the price and transfers winnings.
    // Does NOT transfer ownership of token
    function _bid(uint256 _tokenId, uint256 _bidAmount) internal returns (uint256) {
        // Get a reference to the auction struct
        Auction storage auction = tokenIdToAuction[_tokenId];

        // Explicitly check that this auction is currently live.
        // (because of how Ethereum mappings work, we can't just count
        // on the lookup above failing. An invalid _tokenId will just
        // return an auction object that is all zeros.)
        require(_isOnAuction(auction));

        // Check that the bid is greater than or equal to the current price
        uint256 price = _currentPrice(auction);
        require(_bidAmount >= price);

        // Grab a reference to the seller before the auction struct
        // gets deleted
        address seller = auction.seller;

        // The bid is good! Remove the auction before sending the fees
        // to the sender so we can't have a reentrancy attack.
        _removeAuction(_tokenId);

        // Transfer proceeds to seller (if there are any!)
        if (price > 0) {
            // Calculate the auctioneer's cut.
            // (NOTE: _computeCut() is guaranteed to return a
            // value <= price, so this subtraction can't go negative.)
            uint256 auctioneerCut = _computeCut(price);
            uint256 sellerProceeds = price - auctioneerCut;

            // NOTE: Doing a transfer() in the middle of a complex
            // method like this is generally discouraged because of
            // reentrancy attacks and DoS attacks if the seller is
            // a contract with an invalid fallback function. We explicitly
            // guard aggainst reentrancy attacks by removing the auction
            // before calling transfer(), and the only thing the seller
            // can DoS is the sale of their own asset! (And if it's an
            // accident, they can call cancelAuction().)
            seller.transfer(sellerProceeds);
        }

        // Calculate any excess funds included with the bid. If the excess
        // is anything worth worrying about, transfer it back to bidder.
        // NOTE: We checked above that the bid amount is greater than or
        // equal to the price so this cannot underflow
        uint256 bidExcess = _bidAmount - price;

        // Return the funds. Similar to the previous transfer, this is
        // not susceptible to a re-entry attack because the auction is
        // removed before any transfers occur.
        msg.sender.transfer(bidExcess);

        // Tell the world!
        AuctionSuccessful(_tokenId,price, msg.sender);

        return price;
    }

    // @dev Removes an auction from the list of open auctions.
    // @param _tokenId - ID of NFT on auction.
    function _removeAuction(uint256 _tokenId) internal {
        delete tokenIdToAuction[_tokenId];
    }

    // @dev Returns true if the NFT is on auction.
    // @param _auction - Auction to check.
    function _isOnAuction(Auction storage _auction) internal view returns (bool) {
        return (_auction.startedAt > 0);
    }

    // @dev Returns current price of an NFT on auction. Broken into two
    //  functions (this one, that computes the duration from the auction
    //  structure, and the other that does the price computation) so we 
    //  can easily test that the price computation works correctly.
    function _currentPrice(Auction storage _auction) internal view returns (uint256) {
        uint256 secondsPassed = 0;

        // A bit of insurance against negative values (or wraparound).
        // Progably not necessary (since Ethereum guarantees that the 
        // now variables doesn't ever go backwards).
        if (now > _auction.startedAt) {
            secondsPassed = now - _auction.startedAt;
        }

        return _computeCurrentPrice(
            _auction.startingPrice,
            _auction.endingPrice,
            _auction.duration,
            secondsPassed
        );
    }

    // @dev Computes the current price of an auction. Factored out
    //  from _currentPrice so we can run extensive unit tests.
    //  When testing, make this function public and turn on
    //  'Current price computation' test suite.
    function _computeCurrentPrice(
        uint256 _startingPrice,
        uint256 _endingPrice,
        uint256 _duration,
        uint256 _secondsPassed
    )
        internal
        pure
        returns (uint256)
    {
        // NOTE: We don't use SafeMath (or similar) in this function because
        //  all of our public functions carefully cap the maximum values for
        //  time (at 64-bits) and currency (at 128-bits). _duration is
        //  also known to be non-zero (see the require() statement in
        //  _addAuction())
        if (_secondsPassed >= _duration) {
            // We've reached the end of the dynamic pricing portion
            // of the auction, just return the end price.
            return _endingPrice;
        } else {
            // Starting price can be higher than ending price (and often is!), so
            // this delta can be negative.
            int256 totalPriceChange = int256(_endingPrice) - int256(_startingPrice);

            // This multiplication can't overflow, _secondsPassed will easily fit within
            // 64-bits, and totalPriceChange will easily fit within 128-bits, their product
            // will always fit within 256-bits.
            int256 currentPriceChange = totalPriceChange * int256(_secondsPassed) / int256(_duration);

            // currentPriceChange can be negative, but if so, will have a magnitude
            // less than _startingPrice. Thus, this result will always end up positive.
            int256 currentPrice = int256(_startingPrice) + currentPriceChange;

            return uint256(currentPrice);
        }
    }

    // @dev Computes owner's cut of a sale.
    // #param _price - Sale price of NFT.
    function _computeCut(uint256 _price) internal view returns (uint256) {
        // NOTE: We don't use SafeMath (or similar) in this function because
        //  all of our entry functions carefully cap the maximum values for
        //  currency (at 128-bits), and ownerCut <= 10000 (see the require()
        //  statement in the ClockAuction constructor). The result of this
        //  function is always guaranteed to be <= _price.
        return _price * ownerCut / 10000;
    }
}

contract ClockAuction is Pausable, ClockAuctionBase {
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
        ownerCut = _cut;

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
        
        nftAddress.transfer(nftAddress.balance);
    }

    // @dev Creates and begins a new auction.
    // @param _tokenId - ID of token to auction, sender must be owner.
    // @param _startingPrice - Price of iten (in wei) at beginning of auction.
    // @param _endingPrice - Price of item (in wei) at beginning of auction.
    // @param _duration - Length of time to move between starting
    //  price and ending price (in seconds).
    // @param _seller - Seller, if not the message sender
    function createAuction(
        uint256 _tokenId,
        uint256 _startingPrice,
        uint256 _endingPrice,
        uint256 _duration,
        address _seller
    )
    external
    whenNotPaused
    {
        // Sanity check that no inputs overflow how many bits we've allocated
        // to store them in the auction struct.
        require(_startingPrice == uint256(uint128(_startingPrice)));
        require(_endingPrice == uint256(uint128(_endingPrice)));
        require(_duration == uint256(uint64(_duration)));

        require(_owns(msg.sender, _tokenId));
        _escrow(msg.sender, _tokenId);
        Auction memory auction = Auction(
            _seller,
            uint128(_startingPrice),
            uint128(_endingPrice),
            uint64(_duration),
            uint64(now)
        );
        _addAuction(_tokenId, auction);
    }

    // @dev Bids on an open auction, completing the auction and transferring
    //  ownership of the NFT if enough Ether is supplied
    // @param _tokenId - ID of token to bid on
    function bid(uint256 _tokenId)
        external
        payable
        whenNotPaused
    {
        // _bid will throw if the bid or funs tranfer fails
        _bid(_tokenId, msg.value);
        _transfer(msg.sender, _tokenId);
    }

    // @dev Cancels an auction that hasn't been won yet.
    //  Returns the NFT to original owner.
    // @notice This is a state-modifying function that can
    //  be called while the contract is paused.
    // @param _tokenId - ID of token on auction
    function cancelAuction(uint256 _tokenId)
        external
    {
        Auction storage auction = tokenIdToAuction[_tokenId];
        require(_isOnAuction(auction));
        address seller = auction.seller;
        require(msg.sender == seller);
        _cancelAuction(_tokenId, seller);
    }

    // @dev Cancels an auction when the contract is paused.
    //  Only the owner may do this, and NFTs are returned to
    //  the seller. This should only be used in emergencies.
    // @param _tokenId - ID of the NFT on auction to cancel.
    function cancelAuctionWhenPaused(uint256 _tokenId)
        whenPaused
        onlyOwner
        external
    {
        Auction storage auction = tokenIdToAuction[_tokenId];
        require(_isOnAuction(auction));
        _cancelAuction(_tokenId, auction.seller);
    }

    // @dev Returns auction info for an NFT on auction.
    // @param _tokenId - ID of NFT on auction.
    function getAuction(uint256 _tokenId)
        external
        view
        returns
    (
        address seller,
        uint256 startingPrice,
        uint256 endingPrice,
        uint256 duration,
        uint256 startedAt
    ) {
        Auction storage auction = tokenIdToAuction[_tokenId];
        require(_isOnAuction(auction));
        return (
            auction.seller,
            auction.startingPrice,
            auction.endingPrice,
            auction.duration,
            auction.startedAt
        );
    }

    // @dev Returns the current price of an auction.
    // @param _tokenId - ID of the token price we are checking.
    function getCurrentPrice(uint256 _tokenId)
        external
        view
        returns (uint256)
    {
        Auction storage auction = tokenIdToAuction[_tokenId];
        require(_isOnAuction(auction));
        return _currentPrice(auction);
    }
}

contract SaleClockAuction is ClockAuction {

    // @dev Sanity check that allows us to ensure that we are pointing to the
    //  right auction in our setSaleAuctionAddress() call.
    bool public isSaleClockAuction = true;

    // Tracks last 5 sale price of gen0 cards
    uint256 public gen0SaleCount;
    uint256[5] public lastGen0SalePrices;

    // Delegate constructor
    function SaleClockAuction(address _nftAddr, uint256 _cut) public
        ClockAuction(_nftAddr, _cut) {}

    // @dev Creates and begins a new auction.
    // @param _tokenId - ID of token to auction, sender must be owner.
    // @param _startingPrice - Price of item (in wei) at beginning of auction.
    // @param _endingPrice - Price of item (in wei) at end of auction.
    // @param _duration - Length of auction (in seconds).
    // @param _seller - Seller, if not the message sender
    function createAuction(
        uint256 _tokenId,
        uint256 _startingPrice,
        uint256 _endingPrice,
        uint256 _duration,
        address _seller
    )
        external
    {
        // Sanity check that no inputs overflow how many bits we've allocated
        // to store them in the auction struct.
        require(_startingPrice == uint256(uint128(_startingPrice)));
        require(_endingPrice == uint256(uint128(_endingPrice)));
        require(_duration == uint256(uint64(_duration)));

        require(msg.sender == address(nonFungibleContract));
        _escrow(_seller, _tokenId);
        Auction memory auction = Auction(
            _seller,
            uint128(_startingPrice),
            uint128(_endingPrice),
            uint64(_duration),
            uint64(now)
        );
        _addAuction(_tokenId, auction);
    }

    // @dev Updates lastSalePrice if seller is the nft contract
    // Otherwise, works the same as default bid method.
    function bid(uint256 _tokenId)
        external
        payable
    {
        // _bid verifies token ID size
        address seller = tokenIdToAuction[_tokenId].seller;
        uint256 price = _bid(_tokenId, 5 ether);
        _transfer(msg.sender, _tokenId);

        // If not a gen0 auction, exit
        if (seller == address(nonFungibleContract)) {
            // Track gen0 sale prices
            lastGen0SalePrices[gen0SaleCount % 5] = price;
            gen0SaleCount++;
        }
    }

    function averageGen0SalePrice() external view returns (uint256) {
        uint256 sum = 0;
        for (uint256 i = 0; i < 5; i++) {
            sum += lastGen0SalePrices[i];
        }
        return sum / 5;
    }
}

contract AccessControl {
    /// @dev The addresses of the accounts (or contracts) that can execute actions within each roles
    address public ceoAddress;
    address public cooAddress;

    /// @dev Keeps track whether the contract is paused. When that is true, most actions are blocked
    bool public paused = false;

    /// @dev Access modifier for CEO-only functionality
    modifier onlyCEO() {
        require(msg.sender == ceoAddress);
        _;
    }

    /// @dev Access modifier for COO-only functionality
    modifier onlyCOO() {
        require(msg.sender == cooAddress);
        _;
    }

    /// @dev Access modifier for any CLevel functionality
    modifier onlyCLevel() {
        require(msg.sender == ceoAddress || msg.sender == cooAddress);
        _;
    }

    /// @dev Assigns a new address to act as the CEO. Only available to the current CEO
    /// @param _newCEO The address of the new CEO
    function setCEO(address _newCEO) public onlyCEO {
        require(_newCEO != address(0));
        ceoAddress = _newCEO;
    }

    /// @dev Assigns a new address to act as the COO. Only available to the current CEO
    /// @param _newCOO The address of the new COO
    function setCOO(address _newCOO) public onlyCEO {
        require(_newCOO != address(0));
        cooAddress = _newCOO;
    }

    /// @dev Modifier to allow actions only when the contract IS NOT paused
    modifier whenNotPaused() {
        require(!paused);
        _;
    }

    /// @dev Modifier to allow actions only when the contract IS paused
    modifier whenPaused {
        require(paused);
        _;
    }

    /// @dev Pause the smart contract. Only can be called by the CEO
    function pause() public onlyCEO whenNotPaused {
        paused = true;
    }

    /// @dev Unpauses the smart contract. Only can be called by the CEO
    function unpause() public onlyCEO whenPaused {
        paused = false;
    }
}

contract CryptoCardsBase is AccessControl {

    /*** EVENTS ***/

    // @dev The spawn event is fired whenever a new card is minted
    event Spawn(address owner, uint256 tokenId, uint128 skills);

    // @dev Transfer event as defined in current draft of ERC721. Emitted evry time a 
    //  card ownership is assigned, including minting
    event Transfer(address from, address to, uint256 tokenId);

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
    function _transfer(address _from, address _to, uint256 _tokenId) internal {
        // Increase ownershipTokenCount of address receiving card
        ownershipTokenCount[_to]++;
        // Transfer ownership.
        cardIndexToOwner[_tokenId] = _to;
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

contract CardOwnership is CryptoCardsBase, ERC721 {

    // @notice Name and symbol of the non fungible token, as defined in ERC721
    string public constant name = "CryptoCards";
    string public constant symbol = "CC";

    /*** POTENTIAL METADATA & INTERFACE STUFF ***/
    
    bytes4 constant InterfaceSignature_ERC165 = 
        bytes4(keccak256('supportsInterface(bytes4)'));

     bytes4 constant InterfaceSignature_ERC721 =
        bytes4(keccak256('name()')) ^
        bytes4(keccak256('symbol()')) ^
        bytes4(keccak256('totalSupply()')) ^
        bytes4(keccak256('balanceOf(address)')) ^
        bytes4(keccak256('ownerOf(uint256)')) ^
        bytes4(keccak256('approve(address,uint256)')) ^
        bytes4(keccak256('transfer(address,uint256)')) ^
        bytes4(keccak256('transferFrom(address,address,uint256)')) ^
        bytes4(keccak256('tokensOfOwner(address)')) ^
        bytes4(keccak256('tokenMetadata(uint256,string)'));

    // @notice Introspection interface as per ERC-165 (https://github.com/ethereum/EIPs/issues/165).
    //  Returns true for any standardized interfaces implemented by this contract. We implement
    //  ERC-165 (obviously!) and ERC-721.
    function supportsInterface(bytes4 _interfaceID) external view returns (bool) {
        // DEBUG ONLY
        //require((InterfaceSignature_ERC165 == 0x01ffc9a7) && (InterfaceSignature_ERC721 == 0x9a20483d));

        return ((_interfaceID == InterfaceSignature_ERC165) || (_interfaceID == InterfaceSignature_ERC721));
    }

    /*** INTERNAL UTILITY FUNCTIONS ***/
    // These functions assume that their input arguments are valid.
    // Leaving it to public methods to sanitize inputs

    // @dev Checks if a given address is the current owner of a particular Card
    // @param _claimant the address we are validating against
    // @param _tokenId card id, only valid when > 0
    function _owns(address _claimant, uint256 _tokenId) internal view returns (bool) {
        return cardIndexToOwner[_tokenId] == _claimant;
    }

    // @dev Checks if a given address currently has transferApproval for a pareticular Card.
    // @param _claimant the address we are confirming the kitten is approved for.
    // @param _tokenId Card ID, only valid when > 0
    function _approvedFor(address _claimant, uint256 _tokenId) internal view returns (bool) {
        return cardIndexToApproved[_tokenId] == _claimant;
    }

    // @dev Marks an address as being approved for transferFrom(), overwriting any previous
    //  approval. Setting _approved to address (0) clears all transfer approval.
    //  NOTE: _approve() does NOT send the Approval event. This is intentional because
    //  _approve() and transferFrom() are used together for putting Cards on auction, and
    //  there is no value in spamming the log with Approval events in that case
    function _approve(uint256 _tokenId, address _approved) internal {
        cardIndexToApproved[_tokenId] = _approved;
    }

    // @notice Returns the number of Cards owned by a specific address.
    // @param _owner the owner address to check.
    // @dev Required for ERC721 compliance
    function balanceOf(address _owner) public view returns (uint256 count) {
        return ownershipTokenCount[_owner];
    }

    // @notice Transfers a Card to another address. If transferring to a smart 
    //  contract be VERY CAREFUL to ensure that it is are of ERC721 (or
    //  CryptoCards specifically) or your Card may be lost forever. Fo Rlz.
    // @param _to The address of the recipient
    // @param _tokenId The ID of the Card to transfer
    // @dev Required for ERC721 compliance
    function transfer(address _to, uint256 _tokenId) external whenNotPaused {
        // Safety check to prevent against an unexpected 0x0 default
        require(_to != address(0));
        // Disallow transfers to this contract to prevent accidental misuse.
        // The contract should never own any Cards (except very briefly
        // after a gen0 Card is created and before it goes on auction).
        require(_to != address(this));
        // Disallow transfers to the auction contracts to prevent accidental
        // misuse. Auction contracts should only take ownership of kitties
        // through the allow + transferFrom flow.
        require(_to != address(saleAuction));

        // You can only send your own Card
        require(_owns(msg.sender, _tokenId));

        // Reassign ownership, clear pending approvals, emit Transfer event
        _transfer(msg.sender, _to, _tokenId);
    }

    // @notice Grant another address the right to transfer a specific Card via
    //  transferFrom(). This is the preferred flow for transferring NFTs to contracts.
    // @param _to The address to be granted transfer approval. Pass address(0) to
    //  clear all approvals.
    // @param _tokenId The ID of the Card that can be transferred if this call succeeds.
    // @dev Required for ERC721 compliance
    function approve(address _to, uint256 _tokenId) external whenNotPaused {
        // Only an owner can grant transfer approval.
        require(_owns(msg.sender, _tokenId));

        // Register the approval (replacing any previous approval).
        _approve(_tokenId, _to);

        // Emit approval event.
        Approval(msg.sender, _to, _tokenId);
    }

    // @notice Transfer a Card owned by another address, for which the calling address
    //  has previously been granted transfer approval by the owner.
    // @param _from The address that owns the Card to be transferred.
    // @param _to The address that should take ownershuip of the Card. Can be any address,
    //  including the caller.
    // @param _tokenId The ID of the Card to be transferred.
    // @dev Required for ERC721 compliance.
    function transferFrom(address _from, address _to, uint256 _tokenId) external whenNotPaused {
        // Safety check to prevent against an unexpected 0x0 default.
        require(_to != address(0));
        // Disallow transfers to this contract to prevent accidental misuse.
        // The contract should never own any Cards (except very briefly
        // after a gen0 card is created and before it goes on auction).
        require(_to != address(this));
        // Check for approval and valid ownership
        require(_approvedFor(msg.sender, _tokenId));
        require(_owns(_from, _tokenId));

        // Reassign ownership (also clears pending approvals and emits Transfer event).
        _transfer(_from, _to, _tokenId);
    }

    // @notice Returns the total number of Cards currently in existence.
    // @dev Required for ERC721 compliance.
    function totalSupply() public view returns (uint) {
        return cards.length;
    }

    // @notice Returns the address currently assigned ownership of a given Card.
    // @dev Required for ERC721 compliance.
    function ownerOf(uint256 _tokenId) external view returns (address owner) {
        owner = cardIndexToOwner[_tokenId];

        require(owner != address(0));
    }

    // @notice Returns a list of all Card IDs assigned to an address.
    // @param _owner The owner whose Cards we are interested in.
    // @dev This method MUST NEVER be called by smart contract code. First, it's fairly
    //  expensive (it walks the intire Card array looking for Cards belonging to owner),
    //  but it also returns a dynamic array, which is only supported for web3 calls, and
    //  not contract-to-contract calls.
    function tokensOfOwner(address _owner) external view returns (uint256[] ownerTokens) {
        uint256 tokenCount = balanceOf(_owner);

        if (tokenCount == 0) {
            // Return an empty array
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](tokenCount);
            uint256 totalCards = totalSupply();
            uint256 resultIndex = 0;

            // We count on the fact that all cats have IDs starting at 1 and increasing
            // sequentially up to the totalCard count
            uint256 cardId;

            for (cardId = 0; cardId <= totalCards; cardId++) {
                if (cardIndexToOwner[cardId] == _owner) {
                    result[resultIndex] = cardId;
                    resultIndex++;
                }
            }
            return result;
        }
    }

    // @dev Adapted from memcpy() by @arachnid (Nick Johnson <arachnid@notdot.net>)
    //  This method is licenced under the Apache License.
    //  Ref: https://github.com/Arachnid/solidity-stringutils/blob/2f6ca9accb48ae14c66f1437ec50ed19a0616f78/strings.sol
    function _memcpy(uint _dest, uint _src, uint _len) private view {
        // Copy word-length chuncks while possible
        for(; _len >= 32; _len -= 32) {
            assembly {
                mstore(_dest, mload(_src))
            }
            _dest += 32;
            _src += 32;
        }

        // Copy remaining bytes
        uint256 mask = 256 ** (32 - _len) - 1;
        assembly {
            let srcpart := and(mload(_src), not(mask))
            let destpart := and(mload(_dest), mask)
            mstore(_dest, or(destpart, srcpart))
        }
    }

    // @dev Adapted from toString(slice) by @arachnid (Nick Johnson <arachnid@notdot.net>)
    //  This method is licensed under the Apache License.
    //  Ref: https://github.com/Arachnid/solidity-stringutils/blob/2f6ca9accb48ae14c66f1437ec50ed19a0616f78/strings.sol
    function _toString(bytes[4] _rawBytes, uint256 _stringLength) private view returns (string) {
        var outputString = new string(_stringLength);
        uint256 outputPtr;
        uint256 bytesPtr;

        assembly {
            outputPtr := add(outputString, 32)
            bytesPtr := _rawBytes
        }

        _memcpy(outputPtr, bytesPtr, _stringLength);

        return outputString;
    }
}

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
            5,
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

contract CryptoCardsCore is CardMinting {
    
    // Set in case the core contract is broken and an upgrade is required
    address public newContractAddress;

    // @notice Creates the main CryptoKitties smart contract instance.
    function CryptoCardsCore() public payable {
        // Starts paused.
        paused = false;

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