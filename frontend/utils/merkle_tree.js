import { MerkleTree } from 'merkletreejs';
import { ethers } from 'ethers';
import { Buffer } from 'buffer';

// Polyfill Buffer for the browser environment if needed by libraries
if (typeof window !== 'undefined') {
    window.Buffer = window.Buffer || Buffer;
}

export function encodeLeaf(address) {
    // Same as `abi.encodePacked` in Solidity
    // We lowercase the address to avoid "bad address checksum" errors if the user
    // provides a mixed-case address with an incorrect checksum.
    return ethers.AbiCoder.defaultAbiCoder().encode(
        ["address"],
        [address.toLowerCase()]
    );
}

export function generateMerkleTree(whitelist) {
    // whitelist is an array of addresses (strings)
    const leafNodes = whitelist.map(address => {
        try {
            const encoded = encodeLeaf(address);
            // Use ethers.keccak256 which handles hex strings directly
            return ethers.keccak256(encoded);
        } catch (err) {
            console.error("Error encoding leaf:", address, err);
            throw err;
        }
    });

    // MerkleTree expects buffers or strings. ethers.keccak256 returns 0x-prefixed hex string.
    // merkletreejs handles this fine usually, but let's be explicit.
    const merkleTree = new MerkleTree(leafNodes, ethers.keccak256, { sortPairs: true });
    return merkleTree;
}

export function getMerkleRoot(tree) {
    return tree.getHexRoot();
}

export function getProof(tree, address) {
    const encoded = encodeLeaf(address);
    const leaf = ethers.keccak256(encoded);
    return tree.getHexProof(leaf);
}
