const { ethers } = require("hardhat");
const { generateMerkleTree, getMerkleRoot } = require("./merkle_tree");

async function main() {
  // Example whitelist addresses (replace with real ones for production)
  // For testnet, we can use the deployer's address and some random ones.
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const whitelist = [
    { address: deployer.address, spots: 2 },
    { address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", spots: 2 }, // addr1 from hardhat default
    // Add more addresses here
  ];

  const merkleTree = generateMerkleTree(whitelist);
  const root = getMerkleRoot(merkleTree);

  console.log("Merkle Root:", root);

  const Whitelist = await ethers.getContractFactory("Whitelist");
  const whitelistContract = await Whitelist.deploy(root);

  await whitelistContract.waitForDeployment();

  console.log("Whitelist contract deployed to:", await whitelistContract.getAddress());
  console.log("Verify with:");
  console.log(`npx hardhat verify --network hoodi ${await whitelistContract.getAddress()} ${root}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
