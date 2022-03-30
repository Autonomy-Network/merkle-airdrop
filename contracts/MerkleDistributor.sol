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

    event Claimed(address account, uint256 tokenID, uint256 amount);

    constructor(bytes32 merkleRoot_, address Nft_) {
        merkleRoot = merkleRoot_;
        Nft = Nft_;
    }

    function claim(
        address account,
        uint256 tokenID,
        uint256 amount,
        bytes memory data,
        bytes32[] calldata merkleProof
    ) public {
        // Verify the merkle proof.
        bytes32 node = keccak256(abi.encodePacked(account,tokenID,amount ));

        require(
            MerkleProof.verify(merkleProof, merkleRoot, node),
            "MerkleDistributor: Invalid proof."
        );

        // do your logic accordingly here, call mint function on nft contract (only merkle distributor contract should be able to mint)
        NftContract(Nft).safeMint(account, tokenID, amount, data);

        emit Claimed(account, tokenID, amount);
    }
}
