//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "./NftContract.sol";

/**
  Ref: https://github.com/Uniswap/merkle-distributor
*/
contract MerkleDistributor {
    bytes32 public immutable merkleRoot;
    address public immutable Nft;
    uint256 private tokenID;

    mapping(address => bool) public claimCheck;
    event Claimed(address account, uint256 tokenID, uint256 amount);

    constructor(bytes32 merkleRoot_, address Nft_) {
        merkleRoot = merkleRoot_;
        Nft = Nft_;
        tokenID = 0;
    }

    function claim(
        address account,
        uint256 amount,
        uint256 tokenID,
        bytes memory data,
        bytes32[] calldata merkleProof
    ) public {
        // Verify the merkle proof.
        bytes32 node = keccak256(abi.encodePacked(account));

        require(
            MerkleProof.verify(merkleProof, merkleRoot, node),
            "MerkleDistributor: Invalid proof."
        );

        require(
            claimCheck[account] != true,
            "MerkleDistributor: account already minted"
        );

        // do your logic accordingly here, call mint function on nft contract (only merkle distributor contract should be able to mint)
        claimCheck[account] = true;
        NftContract(Nft).safeMint(account, tokenID, amount, data);

        tokenID++;
        emit Claimed(account, tokenID, amount);
    }
}


