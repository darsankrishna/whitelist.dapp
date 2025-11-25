const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

function encodeLeaf(address) {
  // Same as `abi.encode(msg.sender)` in Solidity
  // abi.encode in Solidity pads to 32 bytes.
  // ethers.utils.defaultAbiCoder.encode(['address'], [address])

  // Let's use ethers for encoding to match Solidity's abi.encode
  const { ethers } = require("hardhat");
  return ethers.AbiCoder.defaultAbiCoder().encode(
    ['address'],
    [address]
  );
}

function generateMerkleTree(whitelist) {
  // whitelist is an array of addresses
  const leafNodes = whitelist.map(address => {
    const encoded = encodeLeaf(address);
    return keccak256(Buffer.from(encoded.slice(2), 'hex'));
  });

  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
  return merkleTree;
}

function getMerkleRoot(tree) {
  return tree.getHexRoot();
}

function getProof(tree, address) {
  const encoded = encodeLeaf(address);
  const leaf = keccak256(Buffer.from(encoded.slice(2), 'hex'));
  return tree.getHexProof(leaf);
}

module.exports = {
  generateMerkleTree,
  getMerkleRoot,
  getProof,
  encodeLeaf
};
