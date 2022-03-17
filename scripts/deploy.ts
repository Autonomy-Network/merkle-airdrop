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

  const nftcontract = await NftContract.deploy('nft contract', 'nft');
  await nftcontract.deployed()

  const distributor = await Distributor.deploy(root, nftcontract.address);
  await distributor.deployed();

  //set distributor on nftcontract 
  await nftcontract.setDistributor(distributor.address);

  //set base uri in nft contract
  await nftcontract.setURI("https://demo-nft-api-app.herokuapp.com/api/creature/", { "gasLimit": "500000" });

  console.log("nftcontract deployed to", nftcontract.address);
  console.log("distributor deployed to", distributor.address);


  // Attempt to claim and verify success
   for (let index = 0; index < users.length; index++) {
     const leaf = elements[index];
     const proof = merkleTree.getHexProof(leaf);

     await distributor.claim(users[index].address, users[index].tokenID, users[index].amount, '0xccf4d2682cee3e6228904274225c040673be1f986e0954a6d963fb472ab20a9c', proof, { "gasLimit": "500000" })
     console.log('claimed to ', users[index].address)
   }

  // const leaf0 = elements[0];
  // const proof0 = merkleTree.getHexProof(leaf0);

  // const leaf1 = elements[1];
  // const proof1 = merkleTree.getHexProof(leaf1);

  // const leaf2 = elements[2];
  // const proof2 = merkleTree.getHexProof(leaf2);



  // await distributor.claim(users[0].address, users[0].tokenID, proof0, { "gasLimit": "500000" })
  // console.log('claimed to ', users[0].address)
  // await distributor.claim(users[1].address, users[1].tokenID, proof1, { "gasLimit": "500000" })
  // console.log('claimed to ', users[1].address)
  // await distributor.claim(users[2].address, users[2].tokenID, proof2, { "gasLimit": "500000" })
  // console.log('claimed to ', users[2].address)


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
