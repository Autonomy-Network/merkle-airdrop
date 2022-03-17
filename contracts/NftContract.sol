// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NftContract is ERC1155, Ownable {
    using Strings for uint256;

    address public MerkleDistributor;
    string private Name;
    string private Symbol;

    constructor( string memory _name, string memory _symbol ) ERC1155("....") {
        Name = _name;
        Symbol = _symbol;
    }

    modifier onlyDistributor() {
        require(msg.sender == MerkleDistributor, "msg sender not distributor");
        _;
    }

    function name() public view returns (string memory) {
        return Name;
    }

    function symbol() public view returns (string memory) {
        return Symbol;
    }

    function setDistributor(address MerkleDistributor_) public onlyOwner {
        MerkleDistributor = MerkleDistributor_;
    }

    function safeMint(
        address to,
        uint256 tokenId,
        uint256 amount,
        bytes memory data
    ) public onlyDistributor {
        _mint(to, tokenId, amount, data);
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        string memory baseURI = _uri;
        return
            bytes(baseURI).length > 0
                ? string(abi.encodePacked(baseURI, tokenId.toString()))
                : "";
    }
}
