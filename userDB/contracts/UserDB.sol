// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";



contract UserDb is ReentrancyGuard, Ownable, AccessControl {

    uint256 public currentEntry; // This variable counts the amount of users registered.


    struct userAccount {
        string accountCid;
        string pictureCid;
        address userId;
    }

    mapping(address => userAccount) public _account;


    bytes32 public constant UPDATER_ROLE = keccak256("UPDATER_ROLE");

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(UPDATER_ROLE, _msgSender());
    }

    function createProfile(string memory newCid, string memory newPictureSid, address wallet)
    external
    nonReentrant
    {
        require(hasRole(UPDATER_ROLE, _msgSender()), "You must have updater role to run");
        currentEntry++;
        _account[wallet].accountCid=newCid;
        _account[wallet].pictureCid=newPictureSid;
        _account[wallet].userId=wallet;

    }
    function getUserProfileData(address wallet) public view returns(userAccount memory){
        return _account[wallet];
    }


    function updateProfile(string memory newCid, address wallet)
    external
    nonReentrant
    {
        require(hasRole(UPDATER_ROLE, _msgSender()), "You must have updater role to run");
        _account[wallet].accountCid=newCid;
        _account[wallet].userId=wallet;
    }

    function updatePicture(string memory newCid, address wallet)
    external
    nonReentrant
    {
        require(hasRole(UPDATER_ROLE, _msgSender()), "You must have updater role to run");
        _account[wallet].pictureCid=newCid;
    }



    function deleteProfile()
    external
    nonReentrant
    {
        require(_account[msg.sender].userId == msg.sender, "Account not found");
        delete _account[msg.sender];

    }

    function confirmUser() external view returns (address){
        address userWallet = _account[msg.sender].userId;
        return userWallet;
    }

}