// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NftMarket is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    struct NftItem {
        uint tokenId;
        uint price;
        address creator;
        bool isListed;
        bool isSold;
    }

    struct RoyaltyInfo {
        address recipient;
        uint256 amount;
    }

    mapping(uint256 => RoyaltyInfo) royaltyPerTokenId;

    //Interface for royalties
    bytes4 private constant _INTERFACE_ID_ERC2981 = 0x2a55205a;

    string public baseTokenURI;

    uint public listingPrice = 0.025 ether;

    Counters.Counter private _listedItems;
    Counters.Counter private _tokenIds;

    mapping(string => bool) private _usedTokenURIs;
    mapping(uint => NftItem) private _idToNftItem;

    mapping(address => mapping(uint => uint)) private _ownedTokens;
    mapping(uint => uint) private _idToOwnedIndex;

    uint256[] private _allNfts;
    mapping(uint => uint) private _idToNftIndex;

    event NftItemCreated (
        uint tokenId,
        uint price,
        address creator,
        bool isListed,
        bool isSold
    );
    event RoyaltyAmountSent (
        address receiver,
        uint tokenId,
        uint royaltyAmount
    );

    //amount of mints that each address has executed.
    mapping(address => uint256) public mintsPerAddress;

    constructor() ERC721("PumpkinNFT", "PNFT") {}

    //ensure that modified function cannot be called by another contract
    modifier callerIsUser() {
        require(tx.origin == msg.sender, "The caller is another contract");
        _;
    }


    function setListingPrice(uint newPrice) external onlyOwner {
        require(newPrice > 0, "Price must be at least 1 wei");
        listingPrice = newPrice;
    }

    function getNftItem(uint tokenId) public view returns (NftItem memory) {
        return _idToNftItem[tokenId];
    }

    function listedItemsCount() public view returns (uint) {
        return _listedItems.current();
    }

    function tokenURIExists(string memory tokenURI) public view returns (bool) {
        return _usedTokenURIs[tokenURI] == true;
    }

    function totalSupply() public view returns (uint) {
        return _allNfts.length;
    }

    function tokenByIndex(uint index) public view returns (uint) {
        require(index < totalSupply(), "Index out of bounds");
        return _allNfts[index];
    }

    function tokenOfOwnerByIndex(address owner, uint index) public view returns (uint) {
        require(index < ERC721.balanceOf(owner), "Index out of bounds");
        return _ownedTokens[owner][index];
    }

    function getAllNftsOnSale() public view returns (NftItem[] memory) {
        uint allItemsCounts = totalSupply();
        uint currentIndex = 0;
        NftItem[] memory items = new NftItem[](_listedItems.current());

        for (uint i = 0; i < allItemsCounts; i++) {
            uint tokenId = tokenByIndex(i);
            NftItem storage item = _idToNftItem[tokenId];

            if (item.isListed == true) {
                items[currentIndex] = item;
                currentIndex += 1;
            }
        }

        return items;
    }

    function getOwnedNfts() public view returns (NftItem[] memory) {
        uint ownedItemsCount = ERC721.balanceOf(msg.sender);
        NftItem[] memory items = new NftItem[](ownedItemsCount);

        for (uint i = 0; i < ownedItemsCount; i++) {
            uint tokenId = tokenOfOwnerByIndex(msg.sender, i);
            NftItem storage item = _idToNftItem[tokenId];
            items[i] = item;
        }

        return items;
    }

    function mintToken(string memory tokenURI, uint price, uint96 royalty) public payable returns (uint) {
        require(!tokenURIExists(tokenURI), "Token URI already exists");
        require(msg.value == listingPrice, "Price must be equal to listing price");
        mintsPerAddress[msg.sender] += _tokenIds.current();
        _tokenIds.increment();
        _listedItems.increment();

        uint newTokenId = _tokenIds.current();
        _idToNftItem[newTokenId].isSold = false;
        if (royalty != 0) {

            _safeMint(msg.sender, newTokenId);
            _setTokenURI(newTokenId, tokenURI);
            _createNftItem(newTokenId, price);
            setRoyalties(msg.sender, royalty, newTokenId);
            _usedTokenURIs[tokenURI] = true;

        } else {
            _safeMint(msg.sender, newTokenId);
            _setTokenURI(newTokenId, tokenURI);
            _createNftItem(newTokenId, price);
            _usedTokenURIs[tokenURI] = true;
        }
        return newTokenId;

    }

    //interface for royalties
    function supportsInterface(bytes4 interfaceId) public view override(ERC721) returns (bool){
        return interfaceId == _INTERFACE_ID_ERC2981 || super.supportsInterface(interfaceId);
    }

    function setRoyalties(address recipient, uint256 value, uint256 tokenId) public {
        require(value <= 100, 'ERC2981Royalties: Too high');
        royaltyPerTokenId[tokenId] = RoyaltyInfo(recipient, value);
    }

    function royaltyInfo(uint256 tokenId, uint256 value) external view returns (address receiver, uint256 royaltyAmount)
    {
        RoyaltyInfo memory royalties = royaltyPerTokenId[tokenId];
        receiver = royalties.recipient;
        royaltyAmount = (value * royalties.amount) / 100;
    }

    function getRoyaltyPerTokenId(uint256 tokenId) public view returns (RoyaltyInfo memory){
        return royaltyPerTokenId[tokenId];
    }

    function changeRoyaltyPerTokenId(uint256 tokenId, uint96 royalty) public {
        royaltyPerTokenId[tokenId].amount = royalty;
    }

    //fallback receive function
    receive() external payable {
        revert();
    }

    function _sentRoyaltyAmount(address creator, uint256 amount) private {
        payable(creator).transfer(amount);
    }

    function buyNft(
        uint tokenId
    ) public payable {
        uint price = _idToNftItem[tokenId].price;
        address owner = ERC721.ownerOf(tokenId);
        require(msg.sender != owner, "You already own this NFT");
        require(msg.value == price, "Please submit the asking price");

        RoyaltyInfo memory royalties = royaltyPerTokenId[tokenId];
        address creator = royalties.recipient;
        uint256 royaltyAmount = (msg.value * royalties.amount) / 100;
        _transfer(owner, msg.sender, tokenId);

        if (_idToNftItem[tokenId].isSold) {
            payable(owner).transfer(msg.value - royaltyAmount);
            _sentRoyaltyAmount(creator, royaltyAmount);
            emit RoyaltyAmountSent(creator, tokenId, royaltyAmount);
        } else {
            uint priceWithRoyalty = _idToNftItem[tokenId].price + royaltyAmount;
            _idToNftItem[tokenId].price = priceWithRoyalty;
            payable(owner).transfer(msg.value);
        }

        _listedItems.decrement();
        _idToNftItem[tokenId].isListed = false;
        _idToNftItem[tokenId].isSold = true;
    }
    //Withdraw money in contract to Owner
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ether left to withdraw");
        (bool success,) = payable(owner()).call{value : balance}("");
        require(success, "Transfer failed.");
    }

    function placeNftOnSale(uint tokenId, uint newPrice) public payable {
        require(ERC721.ownerOf(tokenId) == msg.sender, "You are not owner of this nft");
        require(_idToNftItem[tokenId].isListed == false, "Item is already on sale");
        require(msg.value == listingPrice, "Price must be equal to listing price");

        _idToNftItem[tokenId].isListed = true;
        _idToNftItem[tokenId].price = newPrice;
        _listedItems.increment();
    }


    function removeNftFromSale(uint tokenId) public {
        require(ERC721.ownerOf(tokenId) == msg.sender, "You are not owner of this nft");
        require(_idToNftItem[tokenId].isListed == true, "Item is already removed from sale");
        _idToNftItem[tokenId].isListed = false;
        _listedItems.decrement();
    }

    function setNewPrice(uint tokenId, uint price) public {
        require(ERC721.ownerOf(tokenId) == msg.sender, "You are not owner of this nft");
        RoyaltyInfo memory royalties = royaltyPerTokenId[tokenId];
        uint256 royaltyAmount = (price * royalties.amount) / 100;
        if (_idToNftItem[tokenId].isSold) {
            _idToNftItem[tokenId].price = price + royaltyAmount;
        } else {
            _idToNftItem[tokenId].price = price;
        }

    }

    function _createNftItem(
        uint tokenId,
        uint price
    ) private {
        require(price > 0, "Price must be at least 1 wei");

        _idToNftItem[tokenId] = NftItem(
            tokenId,
            price,
            msg.sender,
            true,
            false
        );
        emit NftItemCreated(tokenId, price, msg.sender, true, false);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint tokenId
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, tokenId);

        if (from == address(0)) {
            _addTokenToAllTokensEnumeration(tokenId);
        } else if (from != to) {
            _removeTokenFromOwnerEnumeration(from, tokenId);
        }

        if (to == address(0)) {
            _removeTokenFromAllTokensEnumeration(tokenId);
        } else if (to != from) {
            _addTokenToOwnerEnumeration(to, tokenId);
        }
    }

    function _addTokenToAllTokensEnumeration(uint tokenId) private {
        _idToNftIndex[tokenId] = _allNfts.length;
        _allNfts.push(tokenId);
    }

    function _addTokenToOwnerEnumeration(address to, uint tokenId) private {
        uint length = ERC721.balanceOf(to);
        _ownedTokens[to][length] = tokenId;
        _idToOwnedIndex[tokenId] = length;
    }

    function _removeTokenFromOwnerEnumeration(address from, uint tokenId) private {
        uint lastTokenIndex = ERC721.balanceOf(from) - 1;
        uint tokenIndex = _idToOwnedIndex[tokenId];

        if (tokenIndex != lastTokenIndex) {
            uint lastTokenId = _ownedTokens[from][lastTokenIndex];

            _ownedTokens[from][tokenIndex] = lastTokenId;
            _idToOwnedIndex[lastTokenId] = tokenIndex;
        }

        delete _idToOwnedIndex[tokenId];
        delete _ownedTokens[from][lastTokenIndex];
    }

    function _removeTokenFromAllTokensEnumeration(uint tokenId) private {
        uint lastTokenIndex = _allNfts.length - 1;
        uint tokenIndex = _idToNftIndex[tokenId];
        uint lastTokenId = _allNfts[lastTokenIndex];

        _allNfts[tokenIndex] = lastTokenId;
        _idToNftIndex[lastTokenId] = tokenIndex;

        delete _idToNftIndex[tokenId];
        _allNfts.pop();
    }
}
