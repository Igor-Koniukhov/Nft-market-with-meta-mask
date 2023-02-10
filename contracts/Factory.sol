// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./NftMarket.sol";

contract Factory {
    using Counters for Counters.Counter;

    struct CollectionNft {
        NftMarket token;
        uint collectionId;
        address creator;
        string name;
        string symbol;
        string collectionURI;
        bool isPublished;
    }

    Counters.Counter private _collectionIds;

    CollectionNft[] public allCollections;


    mapping(address => uint []) private _ownedCollections;

    mapping(uint => CollectionNft) private _idToCollection;

    event collectionCreated(
        address indexed Collection,
        string Name,
        string Symbol,
        string collectionURI,
        uint indexed collectionId
    );

    function collectionsAmount() public view returns (uint) {
        return allCollections.length;
    }

    function getAllCollections() public view returns (CollectionNft[] memory) {
        return allCollections;
    }

    function createCollection(
        string memory Name,
        string memory Symbol,
        string memory collectionURI

    ) public {

        _collectionIds.increment();
        uint newCollectionIds = _collectionIds.current();
        NftMarket token = new NftMarket(Name, Symbol);
        CollectionNft memory newCollection;
        newCollection.collectionId = newCollectionIds;
        newCollection.token = token;
        newCollection.creator = msg.sender;
        newCollection.name = Name;
        newCollection.symbol = Symbol;
        newCollection.collectionURI = collectionURI;
        newCollection.isPublished = true;

        allCollections.push(newCollection);
        _idToCollection[newCollectionIds] = newCollection;
        _ownedCollections[msg.sender].push(newCollectionIds);

        emit collectionCreated(address(token), Name, Symbol, collectionURI, newCollectionIds);
    }

    function setNewCollectionIdentity(uint collectionIds, string memory name, string memory symbol) public {
        require(msg.sender == _idToCollection[collectionIds].creator, "Not owner!");
        _idToCollection[collectionIds].name = name;
        _idToCollection[collectionIds].symbol = symbol;
    }

    function setNewCollectionURI(uint collectionIds, string memory collectionURI) public {
        require(msg.sender == _idToCollection[collectionIds].creator, "Not owner!");
        _idToCollection[collectionIds].collectionURI = collectionURI;
    }

    function getCollectionById(uint collectionIds) public view returns (CollectionNft memory){
        return _idToCollection[collectionIds];
    }

    function publishCollection(uint collectionIds) public {
        _idToCollection[collectionIds].isPublished = true;
    }

    function hideFromPublishedCollection(uint collectionIds) public {
        _idToCollection[collectionIds].isPublished = false;
    }


    function getOwnedCollections() public view returns (CollectionNft[] memory){
        require(_ownedCollections[msg.sender].length > 0, "No collections.");
        uint currentIndex = 0;
        CollectionNft[] memory ownedCollections = new CollectionNft[](_ownedCollections[msg.sender].length);
        for (uint i = 0; i < _ownedCollections[msg.sender].length; i++) {
            CollectionNft storage collection = _idToCollection[_ownedCollections[msg.sender][i]];
            ownedCollections[currentIndex] = collection;
            currentIndex++;
        }
        return ownedCollections;

    }
}
