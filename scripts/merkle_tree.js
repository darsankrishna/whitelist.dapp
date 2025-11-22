const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

function encodeLeaf(address, spots) {
  // Same as `abi.encodePacked(msg.sender, maxAllowanceToMint)` in Solidity?
  // Wait, the contract uses `abi.encode(msg.sender, maxAllowanceToMint)`.
  // abi.encode in Solidity pads to 32 bytes.
  // ethers.utils.defaultAbiCoder.encode(['address', 'uint64'], [address, spots])
  
  // Let's use ethers for encoding to match Solidity's abi.encode
  const { ethers } = require("hardhat");
  return ethers.AbiCoder.defaultAbiCoder().encode(
    ['address', 'uint64'],
    [address, spots]
  );
}

function generateMerkleTree(whitelist) {
  // whitelist is an array of { address, spots }
  const leafNodes = whitelist.map(entry => {
    const encoded = encodeLeaf(entry.address, entry.spots);
    return keccak256(Buffer.from(encoded.slice(2), 'hex'));
  });

  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
  return merkleTree;
}

function getMerkleRoot(tree) {
  return tree.getHexRoot();
}

function getProof(tree, address, spots) {
  const encoded = encodeLeaf(address, spots);
  const leaf = keccak256(Buffer.from(encoded.slice(2), 'hex'));
  return tree.getHexProof(leaf);
}

module.exports = {
  generateMerkleTree,
  getMerkleRoot,
  getProof,
  encodeLeaf
};
