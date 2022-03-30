import { expect } from "chai";
import { ethers } from "hardhat";
import { utils } from "ethers";

import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

describe("MerkleDistributor", function () {
  const users = [
    { address: "0xd8a699f0028E0200D48432EFA6A39E67BAA50557", tokenID: 0, amount: 2 },
    { address: "0xd8a699f0028E0200D48432EFA6A39E67BAA50557", tokenID: 1, amount: 4 },
    { address: "0xaCfC1540F8aF26fFaA13bc3a9618f2224140627B", tokenID: 2, amount: 10 },
    { address: "0xaCfC1540F8aF26fFaA13bc3a9618f2224140627B", tokenID: 3, amount: 7 },
    { address: "0xB34a506b91C5bd1265d0550e9Aa6B6eD5bcc3a39", tokenID: 4, amount: 6 },
    { address: "0xB34a506b91C5bd1265d0550e9Aa6B6eD5bcc3a39", tokenID: 5, amount: 8 },
    { address: "0xF7b40bC5A93Dcbfa5EeBD84231D2C8EC0af1B037", tokenID: 6, amount: 12 },
    { address: "0xF7b40bC5A93Dcbfa5EeBD84231D2C8EC0af1B037", tokenID: 7, amount: 16 },
    { address: "0x29f49B639b705B9AD79C4817d49Dbac5Eb181a2d", tokenID: 8, amount: 14 },
    { address: "0x29f49B639b705B9AD79C4817d49Dbac5Eb181a2d", tokenID: 9, amount: 11 },
    { address: "0xB212126DF8EB1bcE4746861f17FE03da4D7E1641", tokenID: 10, amount: 13 },
    { address: "0xB212126DF8EB1bcE4746861f17FE03da4D7E1641", tokenID: 11, amount: 7 },
    { address: "0xBD71F68C697f0c0C93750a798C741e109F1504c1", tokenID: 12, amount: 10 },
    { address: "0xBD71F68C697f0c0C93750a798C741e109F1504c1", tokenID: 13, amount: 18 },
    { address: "0xd8a699f0028E0200D48432EFA6A39E67BAA50557", tokenID: 14, amount: 2 },
    { address: "0xaCfC1540F8aF26fFaA13bc3a9618f2224140627B", tokenID: 15, amount: 1 },
    { address: "0xB34a506b91C5bd1265d0550e9Aa6B6eD5bcc3a39", tokenID: 16, amount: 5 },
    { address: "0xF7b40bC5A93Dcbfa5EeBD84231D2C8EC0af1B037", tokenID: 17, amount: 100 },
    { address: "0xBD71F68C697f0c0C93750a798C741e109F1504c1", tokenID: 18, amount: 25 },
    { address: "0xaCfC1540F8aF26fFaA13bc3a9618f2224140627B", tokenID: 19, amount: 2 },
    { address: "0x29f49B639b705B9AD79C4817d49Dbac5Eb181a2d", tokenID: 20, amount: 11 },
    { address: "0xd8a699f0028E0200D48432EFA6A39E67BAA50557", tokenID: 21, amount: 4 },
    { address: "0xaCfC1540F8aF26fFaA13bc3a9618f2224140627B", tokenID: 22, amount: 10 },
    { address: "0xaCfC1540F8aF26fFaA13bc3a9618f2224140627B", tokenID: 23, amount: 7 },
    { address: "0xB34a506b91C5bd1265d0550e9Aa6B6eD5bcc3a39", tokenID: 24, amount: 6 },
    { address: "0xB34a506b91C5bd1265d0550e9Aa6B6eD5bcc3a39", tokenID: 25, amount: 8 },
    { address: "0xF7b40bC5A93Dcbfa5EeBD84231D2C8EC0af1B037", tokenID: 26, amount: 12 },
    { address: "0xF7b40bC5A93Dcbfa5EeBD84231D2C8EC0af1B037", tokenID: 27, amount: 16 },
    { address: "0x29f49B639b705B9AD79C4817d49Dbac5Eb181a2d", tokenID: 28, amount: 14 },
    { address: "0x29f49B639b705B9AD79C4817d49Dbac5Eb181a2d", tokenID: 29, amount: 11 },
    { address: "0xB212126DF8EB1bcE4746861f17FE03da4D7E1641", tokenID: 30, amount: 13 },
    { address: "0xB212126DF8EB1bcE4746861f17FE03da4D7E1641", tokenID: 31, amount: 7 },
    { address: "0xBD71F68C697f0c0C93750a798C741e109F1504c1", tokenID: 32, amount: 10 },
    { address: "0xBD71F68C697f0c0C93750a798C741e109F1504c1", tokenID: 33, amount: 18 },
    { address: "0xd8a699f0028E0200D48432EFA6A39E67BAA50557", tokenID: 34, amount: 2 },
    { address: "0xaCfC1540F8aF26fFaA13bc3a9618f2224140627B", tokenID: 35, amount: 1 },
    { address: "0xB34a506b91C5bd1265d0550e9Aa6B6eD5bcc3a39", tokenID: 36, amount: 5 },
    { address: "0xF7b40bC5A93Dcbfa5EeBD84231D2C8EC0af1B037", tokenID: 37, amount: 100 },
    { address: "0xBD71F68C697f0c0C93750a798C741e109F1504c1", tokenID: 38, amount: 25 },
    { address: "0xaCfC1540F8aF26fFaA13bc3a9618f2224140627B", tokenID: 39, amount: 2 },
    { address: "0x29f49B639b705B9AD79C4817d49Dbac5Eb181a2d", tokenID: 40, amount: 11 },
    { address: "0xd8a699f0028E0200D48432EFA6A39E67BAA50557", tokenID: 41, amount: 4 },
    { address: "0xaCfC1540F8aF26fFaA13bc3a9618f2224140627B", tokenID: 42, amount: 10 },
    { address: "0xaCfC1540F8aF26fFaA13bc3a9618f2224140627B", tokenID: 43, amount: 7 },
    { address: "0xB34a506b91C5bd1265d0550e9Aa6B6eD5bcc3a39", tokenID: 44, amount: 6 },
    { address: "0xB34a506b91C5bd1265d0550e9Aa6B6eD5bcc3a39", tokenID: 45, amount: 8 },
    { address: "0xF7b40bC5A93Dcbfa5EeBD84231D2C8EC0af1B037", tokenID: 46, amount: 12 },
    { address: "0xF7b40bC5A93Dcbfa5EeBD84231D2C8EC0af1B037", tokenID: 47, amount: 16 },
    { address: "0x29f49B639b705B9AD79C4817d49Dbac5Eb181a2d", tokenID: 48, amount: 14 },
    { address: "0x29f49B639b705B9AD79C4817d49Dbac5Eb181a2d", tokenID: 49, amount: 11 },
    { address: "0xB212126DF8EB1bcE4746861f17FE03da4D7E1641", tokenID: 50, amount: 13 },
    { address: "0xB212126DF8EB1bcE4746861f17FE03da4D7E1641", tokenID: 51, amount: 7 },
    { address: "0xBD71F68C697f0c0C93750a798C741e109F1504c1", tokenID: 52, amount: 10 },
    { address: "0xBD71F68C697f0c0C93750a798C741e109F1504c1", tokenID: 53, amount: 18 },
    { address: "0xd8a699f0028E0200D48432EFA6A39E67BAA50557", tokenID: 54, amount: 2 },
    { address: "0xaCfC1540F8aF26fFaA13bc3a9618f2224140627B", tokenID: 55, amount: 1 },
    { address: "0xB34a506b91C5bd1265d0550e9Aa6B6eD5bcc3a39", tokenID: 56, amount: 5 },
    { address: "0xF7b40bC5A93Dcbfa5EeBD84231D2C8EC0af1B037", tokenID: 57, amount: 100 },
    { address: "0xBD71F68C697f0c0C93750a798C741e109F1504c1", tokenID: 58, amount: 25 },
    { address: "0xaCfC1540F8aF26fFaA13bc3a9618f2224140627B", tokenID: 59, amount: 2 },
    { address: "0x29f49B639b705B9AD79C4817d49Dbac5Eb181a2d", tokenID: 60, amount: 11 },
  ];

  // equal to MerkleDistributor.sol #keccak256(abi.encodePacked(account, tokenID, amount));
  const elements = users.map((x) =>
    utils.solidityKeccak256(["address", "uint256", "uint256"], [x.address, x.tokenID, x.amount])
  );

  it("should claim successfully for valid proof", async () => {
    const merkleTree = new MerkleTree(elements, keccak256, { sort: true });

    const root = merkleTree.getHexRoot();

    const leaf = elements[3];
    const proof = merkleTree.getHexProof(leaf);

    // Deploy contracts
    const Distributor = await ethers.getContractFactory("MerkleDistributor");
    const NftContract = await ethers.getContractFactory("NftContract");

    const nftcontract = await NftContract.deploy("test token", "TST");
    await nftcontract.deployed()

    const distributor = await Distributor.deploy(root, nftcontract.address);
    await distributor.deployed();

    //set distributor on nftcontract 
    await nftcontract.setDistributor(distributor.address);

    // Attempt to claim and verify success
    await expect(distributor.claim(users[3].address, users[3].tokenID, users[3].amount, [], proof))
      .to.emit(distributor, "Claimed")
      .withArgs(users[3].address, users[3].tokenID, users[3].amount);
  });

  it("should throw for invalid tokenID or address or amount", async () => {
    const merkleTree = new MerkleTree(elements, keccak256, { sort: true });

    const root = merkleTree.getHexRoot();

    const leaf = elements[3];
    const proof = merkleTree.getHexProof(leaf);

    // Deploy contracts
    const Distributor = await ethers.getContractFactory("MerkleDistributor");
    const NftContract = await ethers.getContractFactory("NftContract");

    const nftcontract = await NftContract.deploy("Test Token", "TST");
    await nftcontract.deployed()

    const distributor = await Distributor.deploy(root, nftcontract.address);
    await distributor.deployed();

    //set distributor on nftcontract 
    await nftcontract.setDistributor(distributor.address);

    // random tokenID, use 100000 as random ID
    await expect(
      distributor.claim(users[3].address, 100000, users[3].amount, [], proof)
    ).to.be.revertedWith("MerkleDistributor: Invalid proof.");

    // random address
    await expect(
      distributor.claim(
        "0x94069d197c64D831fdB7C3222Dd512af5339bd2d",
        users[3].tokenID,
        users[3].amount,
        [],
        proof
      )
    ).to.be.revertedWith("MerkleDistributor: Invalid proof.");

    // random amount, use 20000 as random amount 
    await expect(
      distributor.claim(
        users[3].address,
        users[3].tokenID,
        20000,
        [],
        proof
      )
    ).to.be.revertedWith("MerkleDistributor: Invalid proof.");
  });



  it("should throw for invalid proof", async () => {
    const merkleTree = new MerkleTree(elements, keccak256, { sort: true });

    const root = merkleTree.getHexRoot();

    // Deploy contracts
    const Distributor = await ethers.getContractFactory("MerkleDistributor");
    const NftContract = await ethers.getContractFactory("NftContract");

    const nftcontract = await NftContract.deploy("TEST TOKEN", "TST");
    await nftcontract.deployed()

    const distributor = await Distributor.deploy(root, nftcontract.address);
    await distributor.deployed();

    //set distributor on nftcontract 
    await nftcontract.setDistributor(distributor.address);

    // Attempt to claim and verify success
    await expect(
      distributor.claim(users[3].address, users[3].tokenID, users[3].amount, [], [])
    ).to.be.revertedWith("MerkleDistributor: Invalid proof.");
  });
});
