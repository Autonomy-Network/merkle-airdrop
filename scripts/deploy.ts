// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import { utils } from "ethers";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  // Deploy contracts

  //this is the airdrop user data 
  const users = [
    { address: "0xaCfC1540F8aF26fFaA13bc3a9618f2224140627B", tokenID: 1 },
    { address: "0xB34a506b91C5bd1265d0550e9Aa6B6eD5bcc3a39", tokenID: 2 },
    { address: "0xF7b40bC5A93Dcbfa5EeBD84231D2C8EC0af1B037", tokenID: 3 },
  ];

  // equal to MerkleDistributor.sol #keccak256(abi.encodePacked(account, tokenID));
  const elements = users.map((x) =>
    utils.solidityKeccak256(["address", "uint256"], [x.address, x.tokenID])
  );

  const merkleTree = new MerkleTree(elements, keccak256, { sort: true });

  //get hex root of data 
  const root = merkleTree.getHexRoot();


  //deploy contracts 
  const Distributor = await ethers.getContractFactory("MerkleDistributor");
  const NftContract = await ethers.getContractFactory("NftContract");

  const nftcontract = await NftContract.deploy();
  await nftcontract.deployed()

  const distributor = await Distributor.deploy(root, nftcontract.address);
  await distributor.deployed();

  //set distributor on nftcontract 
  await nftcontract.setDistributor(distributor.address);

  //set base uri in nft contract
  await nftcontract.setBaseURI("https://nft-api-please-work.herokuapp.com/api/creature/", { "gasLimit": "500000" });

  console.log("nftcontract deployed to", nftcontract.address);
  console.log("distributor deployed to", distributor.address);


  // Attempt to claim and verify success

  const leaf0 = elements[0];
  const proof0 = merkleTree.getHexProof(leaf0);

  const leaf1 = elements[1];
  const proof1 = merkleTree.getHexProof(leaf1);

  const leaf2 = elements[2];
  const proof2 = merkleTree.getHexProof(leaf2);



  await distributor.claim(users[0].address, users[0].tokenID, proof0, { "gasLimit": "500000" })
  console.log('claimed to ', users[0].address)
  await distributor.claim(users[1].address, users[1].tokenID, proof1, { "gasLimit": "500000" })
  console.log('claimed to ', users[1].address)
  await distributor.claim(users[2].address, users[2].tokenID, proof2, { "gasLimit": "500000" })
  console.log('claimed to ', users[2].address)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
