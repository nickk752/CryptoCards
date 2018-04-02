pragma solidity ^0.4.18;

import "./AccessControl.sol";
import "./ERC721.sol";
import "./SafeMath.sol";

contract DetailedERC721 is ERC721 {
    function name() public view returns (string _name);
    function symbol() public view returns (string _symbol);
}

contract CryptoCards is AccessControl, DetailedERC721 {
    using SafeMath for uint256;
    
    event TokenCreated(uint256 tokenId, string name, bytes5 dna, uint256 price, address owner);
    event TokenSold(uint256 indexed tokenId,
        string name,
        bytes5 dna,
        uint256 sellingPrice,
        uint256 newPrice,
        address indexed oldOwner,
        address indexed newOwner);
	
    mapping (uint256 => address) private tokenIdToOwner;
    mapping (uint256 => uint256) private tokenIdToPrice;
    mapping (address => uint256) private ownershipTokenCount; //number of tokens owned by an address
    mapping (uint256 => address) private tokenIdToApproved;
    
    struct Card {
        string name;
        bytes5 dna;
    }
    
    Card[] private cards;
    
    uint256 private startingPrice = 0.001 ether;
    bool private erc721Enabled = false; // Allow us to toggle between ERC721 & ERC20 for backwards compatibility

    modifier onlyERC721 () {
        require(erc721Enabled);
        _;
    }

    function createToken(string _name, address _owner, uint256 _price) public onlyCLevel {
        require(_owner != address(0));
        require(_price >= startingPrice);

        bytes5 _dna = _generateRandomDna();
        _createToken(_name, _dna, _owner, _price);
    }

    function createToken(string _name) public onlyCLevel {
        bytes5 _dna = _generateRandomDna();
        _createToken(_name,_dna, address(this), startingPrice);
    }

    function _generateRandomDna() private view returns (bytes5) {
        uint256 lastBlockNumber = block.number - 1;
        bytes32 hashVal = bytes32(block.blockhash(lastBlockNumber));
        bytes5 dna = bytes5((hashVal & 0xffffffff) << 216);
        return dna;
    }

    function _createToken(string _name, bytes5 _dna, address _owner, uint256 _price) private {
        Card memory _card = Card({
            name: _name,
            dna: _dna
        });
        uint256 newTokenId = cards.push(_card) - 1;
        tokenIdToPrice[newTokenId] = _price;

        TokenCreated(newTokenId, _name, _dna, _price, _owner);

        _transfer(address(0), _owner, newTokenId);
    }

    function getToken(uint256 _tokenId) public view returns (
        string _tokenName,
        bytes5 _dna,
        uint256 _price,
        uint256 _nextPrice,
        address _owner
    ) {
        _tokenName = cards[_tokenId].name;
        _dna = cards[_tokenId].dna;
        _price = tokenIdToPrice[_tokenId];
        _nextPrice = nextPriceOf(_tokenId);
        _owner = tokenIdToOwner[_tokenId];
    }

    function getAllTokens() public view returns (
        uint256[],
        uint256[],
        address[]
    ) {
        uint256 total = totalSupply();
        uint256[] memory prices = new uint256[](total);
        uint256[] memory nextPrices = new uint256[](total);
        address[] memory owners = new address[](total);

        for (uint256 i = 0; i < total; i++) {
            prices[i] = tokenIdToPrice[i];
            nextPrices[i] = nextPriceOf(i);
            owners[i] = tokenIdToOwner[i];
        }

        return (prices, nextPrices, owners);
    }

    function tokensOf(address _owner) public view returns(uint256[]) {
        uint256 tokenCount = balanceOf(_owner);
        if (tokenCount == 0) {
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](tokenCount);
            uint256 total = totalSupply();
            uint256 resultIndex = 0;

            for (uint256 i = 0; i < total; i++) {
                if (tokenIdToOwner[i] == _owner) {
                    result[resultIndex] = i;
                    resultIndex++;
                }
            }
            return result;
        }
    }

    function withdrawBalance(address _to, uint256 _amount) public onlyCEO {
        require (_amount <= this.balance);

        if (_amount == 0) {
            _amount = this.balance;
        }

        if (_to == address(0)){
            ceoAddress.transfer(_amount);
        } else {
            _to.transfer(_amount);
        }
    }

    function purchase(uint256 _tokenId) public payable whenNotPaused {
        address oldOwner = ownerOf(_tokenId);
        address newOwner = msg.sender;
        uint256 sellingPrice = priceOf(_tokenId);

        require(oldOwner != address(0));
        require(newOwner != address(0));
        require(oldOwner != newOwner);
        require(!_isContract(newOwner));
        require(sellingPrice > 0);
        require(msg.value >= sellingPrice);

        _transfer(oldOwner, newOwner, _tokenId);

        TokenSold(
            _tokenId,
            cards[_tokenId].name,
            cards[_tokenId].dna,
            sellingPrice,
            priceOf(_tokenId),
            oldOwner,
            newOwner
        );

        uint256 excess = msg.value.sub(sellingPrice);
        uint256 contractCut = sellingPrice.mul(6).div(100); // 6% cut

        if (oldOwner != address(this)) {
            oldOwner.transfer(sellingPrice.sub(contractCut));
        }

        if (excess > 0) {
            newOwner.transfer(excess);
        }
    }

    function priceOf(uint256 _tokenId) public view returns (uint256 _price) {
        return tokenIdToPrice[_tokenId];
    }

    uint256 private increaseLimit1 = 0.02 ether;
    uint256 private increaseLimit2 = 0.5 ether;
    uint256 private increaseLimit3 = 2 ether;
    uint256 private increaseLimit4 = 5 ether;

    function nextPriceOf(uint256 _tokenId) public view returns (uint256 _nextPrice) {
        uint256 _price = priceOf(_tokenId);
        if (_price < increaseLimit1) {
            return _price.mul(200).div(95);
        } else if (_price < increaseLimit2) {
            return _price.mul(135).div(96);
        } else if (_price < increaseLimit3) {
            return _price.mul(125).div(97);
        } else if (_price < increaseLimit4) {
            return _price.mul(117).div(97);
        } else {
            return _price.mul(115).div(98);
        }
    }

    function enableERC721() public onlyCEO {
        erc721Enabled = true;
    }

    function totalSupply() public view returns (uint256 _totalSupply) {
        _totalSupply = cards.length;
    }

    function balanceOf(address _owner) public view returns (uint256 _balance) {
        _balance = ownershipTokenCount[_owner];
    }

    function ownerOf(uint256 _tokenId) public view returns (address _owner) {
        _owner = tokenIdToOwner[_tokenId];
    }

    function approve(address _to, uint256 _tokenId) public whenNotPaused onlyERC721 {
        require(_owns(msg.sender, _tokenId));
        tokenIdToApproved[_tokenId] = _to;
        Approval(msg.sender, _to, _tokenId);
    }

    function transferFrom(address _from, address _to, uint256 _tokenId) public whenNotPaused onlyERC721 {
        require(_to != address(0));
        require(_owns(_from, _tokenId));
        require(_approved(msg.sender, _tokenId));

        _transfer(_from, _to, _tokenId);
    }

    function transfer(address _to, uint256 _tokenId) public whenNotPaused onlyERC721 {
        require(_to != address(0));
        require(_owns(msg.sender, _tokenId));

        _transfer(msg.sender, _to, _tokenId);
    }

    function implementsERC721() public view whenNotPaused returns (bool) {
        return erc721Enabled;
    }

    function takeOwnership(uint256 _tokenId) public whenNotPaused onlyERC721 {
        require(_approved(msg.sender, _tokenId));
        _transfer(tokenIdToOwner[_tokenId], msg.sender, _tokenId);
    }

    function name() public view returns (string _name) {
        _name = "CryptoCards";
    }

    function symbol() public view returns (string _symbol) {
        _symbol = "CCT";
    }

    function _owns(address _claimant, uint256 _tokenId) private view returns (bool) {
        return tokenIdToOwner[_tokenId] == _claimant;
    }

    function _approved(address _to, uint256 _tokenId) private view returns (bool) {
        return tokenIdToApproved[_tokenId] == _to;
    }

    function _transfer(address _from, address _to, uint256 _tokenId) private {
        ownershipTokenCount[_to]++;
        tokenIdToOwner[_tokenId] = _to;

        if (_from != address(0)) {
            ownershipTokenCount[_from]--;
            delete tokenIdToApproved[_tokenId];
        }

        Transfer(_from, _to, _tokenId);
    }

    function _isContract(address addr) private view returns (bool) {
        uint256 size;
        assembly {size := extcodesize(addr) }
        return size > 0;
    }
}