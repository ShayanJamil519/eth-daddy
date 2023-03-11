// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ETHDaddy is ERC721 {
    uint256 private maxSupply;   // max number of nfts created
    uint256 private totalSupply;  // total nfts created at particular time
    address private owner;

    struct Domain{
        string name;
        uint256 cost;
        bool isOwned;
    }

    mapping(uint256 => Domain) domains;

    modifier onlyOwner(){
          require(msg.sender==owner, "Only Contract Owner can List Domains");
        _;
    }

    constructor(string memory _name,string memory _symbol)
    ERC721(_name, _symbol){
        owner =  msg.sender;
    }

    function list(string memory _name, uint256 _cost) public onlyOwner {
        maxSupply++;
        domains[maxSupply] = Domain(_name, _cost, false);

    }

    function mint (uint256 _id) public payable {
        require(_id != 0, "Can't mint unlisted domains");
        require(_id <= maxSupply , "Can't mint more domains than maxSupply");
        require(domains[_id].isOwned == false, "Domain already owned");
        require(msg.value >= domains[_id].cost, "Less cost price of domain is given");

        domains[_id].isOwned = true;
        totalSupply++;

        _safeMint(msg.sender, _id);
    }

    function withdraw() public onlyOwner{
        (bool success, ) = owner.call{value:address(this).balance}("");
        require(success);
    }


    // getters
    function getDomain(uint256 _id) public view returns(Domain memory){
        return domains[_id];
    }

    function getBalance() public view returns(uint256){
        return address(this).balance;
    }


    function getMaxSupply() public view returns(uint256){
        return maxSupply;
    }

    function getTotalSupply() public view returns(uint256){
        return totalSupply;
    }

    function getOwner() public view returns(address){
        return owner;
    }


}


