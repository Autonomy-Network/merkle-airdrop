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
    { address: "0xaCfC1540F8aF26fFaA13bc3a9618f2224140627B", tokenID: 10 },
    { address: "0xB34a506b91C5bd1265d0550e9Aa6B6eD5bcc3a39", tokenID: 15 },
    { address: "0xF7b40bC5A93Dcbfa5EeBD84231D2C8EC0af1B037", tokenID: 20 },
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

  console.log("nftcontract deployed to", nftcontract.address);
  console.log("distributor deployed to", distributor.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
