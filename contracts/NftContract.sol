// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NftContract is ERC721, Ownable {
    address public MerkleDistributor;

    constructor() ERC721("NftContract", "NFT") {}

    modifier onlyDistributor() {
        require(msg.sender == MerkleDistributor, "msg sender not distributor");
        _;
    }

    function setDistributor(address MerkleDistributor_) public onlyOwner {
        MerkleDistributor = MerkleDistributor_;
    }

    function safeMint(address to, uint256 tokenId) public onlyDistributor {
        _safeMint(to, tokenId);
    }
}
